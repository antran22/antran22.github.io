---
layout: blog_page_layout.njk
title: Installing spotifyd on Ubuntu Server
summary: How to play Spotify on a pre-existing Ubuntu Server instance.
tags:
  - linux
  - foss
---

## Why

I am thinking of building a small queuing system for people to request songs to play in the office.
This system should consist of a queuing website, a Spotify Connect controller and a Spotify Player.

First, I need a Spotify Connect player. There is two approaches to this problem:

- Buying a ready-made Google Home or something similar, but the geek in me had taken a disdain to that approach because:
  - It's kinda costly.
  - You are paying Google to eavesdrop on you (not that they haven't already been doing it)
- Build a Spotify Connect player from existing hardware and open source software

You know I'll pick the second option, because if not then why are we even here.

## The Hardware

I am running a small, old laptop in the office, which, most of the time, only run a few Docker containers.
So I figure, why don't I install Spotify on it.

The pros:

- No need to buy any hardware. Everything needed to play audio is already present on the laptop.
- The laptop has 3.5mm jack, so I can plug an aux to an external speaker and get even better sound quality.

The cons:

- This server is running Ubuntu Server, so no preconfigured audio.

Let's install audio driver then.

### Installing audio driver on Ubuntu:

Luckily the process of installing audio on Ubuntu is simple
(check this [stackoverflow answer](https://askubuntu.com/questions/722685/realtek-audio-drivers-for-ubuntu)).
All you need to do is to install `alsa`:
{% Shell %}
sudo apt-get install linux-sound-base alsa-base alsa-utils
{% endShell %}

And then run a quick speaker test.

{% Shell %}
sudo speaker-test
%|speaker-test 1.2.2
%|
%|Playback device is default
%|Stream parameters are 48000Hz, S16_LE, 1 channels
%|Using 16 octaves of pink noise
%|ALSA lib pcm_dmix.c:1089:(snd_pcm_dmix_open) unable to open slave
%|Playback open error: -2,No such file or directory
{% endShell %}

`sudo`ing whenever you have to play audio makes no sense,
so I followed this answer [stackoverflow answer](https://askubuntu.com/questions/8362/setting-up-audio-on-a-server-install)
to put my user into the audio group `sudo chmod -aG audio $USER`

- Select the correct sound card for `speaker-test`.
  I found out about this after fumbling around with `aplay -l` and it's fuller version `aplay -L` and the `speaker-test` man page.
  In a nutshell, look for the default, non-HDMI device:

{% Shell %}
aplay -L
%|...
%|default:CARD=PCH
%| HDA Intel PCH, ALC3226 Analog
%| Default Audio Device
%|...
%|
speaker-test -Ddefault:PCH # PCH is the part that goes after CARD= above
%|Playback device is default:PCH
%|Stream parameters are 48000Hz, S16_LE, 1 channels
%|Using 16 octaves of pink noise
%|Rate set to 48000Hz (requested 48000Hz)
%|Buffer size range from 2048 to 8192
%|Period size range from 1024 to 1024
%|Using max buffer size 8192
%|Periods = 4
%|was set period_size = 1024
%|was set buffer_size = 8192
%| 0 - Front Left
%|...
{% endShell %}

Still no audio, even though the command doesn't show any error.
I came to the conclusion that the volume is probably muted, and proceeded to try to unmute it.
Unfortunately, the hardware volume button of the laptop wouldn't work on the Ubuntu Server installation, so we need to use
`alsamixer`. Try `alsamixer -c0`, `alsamixer -c1` until you find the correct controller for the sound-card.

{% Image "spotifyd/alsamixer.png", "The TUI of AlsaMixer" %}

Use arrow keys, move it to any muted slider and press `M` to unmute it.
Then I reran the `speaker-test -Ddefault:PCH` command one last time, and sweet pink noise start to fill up both of my ears.
Seriously though, take care to set your volume at a relative low level, or you may risk destroying something,
either your eardrums or the loudspeaker. Working with audio is no joking matter.

## The Software:

For the software, I'm using [Spotifyd](https://github.com/Spotifyd/spotifyd), a Spotify thin client that run
as a daemon, which can be used to cast Spotify Connect music to.
`Spotifyd` runs on top of [librespot](https://github.com/librespot-org/librespot), an awesome community-backend
reverse-engineering effort.

An important note: `librespot` is probably not DMCA-friendly, so take care when you are using this for any commercial purpose.

### Installing `Spotifyd`:

Installing `Spotifyd` on Ubuntu is not a single-command, copy-paste operation, but still is rather simple.
Check the [wiki](https://spotifyd.github.io/spotifyd/installation/Ubuntu.html) for more information.
We will build the `spotifyd` binary from source.

{% Shell %}
sudo apt install rustc cargo libasound2-dev libssl-dev pkg-config
git clone https://github.com/Spotifyd/spotifyd.git
cd spotifyd
cargo build --release
{% endShell %}

A binary is produced at `./target/release/spotifyd`. We should move it to `/usr/bin` for more convenient use.

{% Shell %}
cp ./target/release/spotifyd /usr/bin
spotifyd --no-daemon # test the installation
%|No config file specified. Running with default values
%|No proxy specified
%|...
{% endShell %}

The binary seems to have compiled fine. Time to configure.

### Running `Spotifyd`:

Disclaimer: `Spotifyd` (in fact `librespot`) only works with
Take note of the following variables:

- Sound card name, the one you used for `speaker-test` above. For me, it is `default:PCH`.
- Spotify username.
- Spotify password.

Let's run `Spotifyd`:
{% Shell %}
spotifyd -u $SPOTIFY_USERNAME -p $SPOTIFY_PASSWORD --no-daemon --device-name "SpotifySpeaker" --device $SOUND_CARD
%|No config file specified. Running with default values
%|No proxy specified
%|Using software volume controller.
%|Connecting to AP "ap.spotify.com:443"
%|Authenticated as "------------------" !
%|Country: "--"
%|Using Alsa sink with format: S16
{% endShell %}

The Spotify client on my computer could detect the `SpotifySpeaker` device in the network, but was unable to connect.
This is a really weird bug, and I didn't know for sure how I fixed it, but I suspect it is because of the `avahi` networking
suite that powers the Spotify Connect API. If you encounter this same problem, please try:
{% Shell %}
sudo apt install avahi-utils
{% endShell %}

If this command fixes the bug, please let me know at [trancongvietan22@gmail.com](mailto:trancongvietan22@gmail.com).

### Configuring `Spotifyd`:

If you have finished the step above and is able to play some music on the server, congratulations.
Those final steps is just for cleaning up everything.

First, create a configuration file, per this [format](https://spotifyd.github.io/spotifyd/config/File.html).
I have only set a few variables, just like below.

```
[global]

# Your Spotify account name.
username = "$SPOTIFY_USER"

# Your Spotify account password.
password = "$SPOTIFY_PASSWORD"

device = "default:PCH"

# The name that gets displayed under the connect tab on
# official clients. Spaces are not allowed!
device_name = "SpotifySpeaker"

# The audio bitrate. 96, 160 or 320 kbit/s
bitrate = 320

# The directory used to cache audio data. This setting can save
# a lot of bandwidth when activated, as it will avoid re-downloading
# audio files when replaying them.
#
# Note: The file path does not get expanded. Environment variables and
# shell placeholders like $HOME or ~ don't work! Put the whole absolute path here
cache_path = "/home/username/.spotify_cache"

# If set to true, audio data does NOT get cached.
no_audio_cache = false

# After the music playback has ended, start playing similar songs based on the previous tracks.
autoplay = true
```

Secondly, create a `systemd` configuration so this daemon will be automatically launched on boot.
Go back to the `spotifyd` source code repo that you cloned.

{% Shell %}
sudo cp contrib/spotifyd.service /etc/systemd/user/
systemctl --user start spotifyd.service
systemctl --user enable spotifyd.service
{% endShell %}

## Conclusion

It was a lot of fun trying to working this out, and the result is very satisfying. Suck it Google Home.
Here's me playing some music on the new Spotify player.

{% Image "spotifyd/spotify-player.png", "Spotify Client streaming music over to YoungITSpeaker" %}

If you really want to go headless and control the playback on the server,
try [Spotify TUI](https://github.com/Rigellute/spotify-tui).
