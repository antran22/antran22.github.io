---
layout: blog_page_layout.njk
title: Installing spotifyd on Ubuntu Server
summary: How to play Spotify on an pre-existing Ubuntu Server instance.
tags: 
  - linux
  - foss

---

## Why

I am thinking of building a small queuing system for people to request songs to play in the office.
This system should consist of a queuing website, a Spotify Connect controller and a Spotify Player.
You can get a working Spotify Connect receiver by buying a ready-made Google Assistant or something similar,
but the geek in me had taken a disdain to that approach:

- It's kinda costly.
- You are bringing another of Google's eavesdropping instrument in your space.

In the spirit of FOSS, I'll create a Spotify Connect receiver from open source programs.

## The Hardware

I am running a small, old laptop in the office, which, most of the time, only run a few Docker containers.
So I figure, why don't install Spotify Player on it.

The pros:

- No need to buy any hardware. Everything needed to play audio is already present on the laptop.
- The laptop has 3.5mm jack, so I can plug an aux to an external speaker and get even better sound quality.

The cons:

- This server is running Ubuntu Server, so no preconfigured audio.

### Giving the server a voice:

Luckily the process of installing audio on Ubuntu is simple
(check this [stackoverflow answer](https://askubuntu.com/questions/722685/realtek-audio-drivers-for-ubuntu)).
All you need to do is to install `alsa`:
{% Shell %}
sudo apt-get install linux-sound-base alsa-base alsa-utils
{% endShell %}

And then run a quick speaker test, or so I thought.

{% Shell %}
speaker-test
%|
%|speaker-test 1.2.2
%|
%|Playback device is default
%|Stream parameters are 48000Hz, S16_LE, 1 channels
%|Using 16 octaves of pink noise
%|ALSA lib confmisc.c:767:(parse_card) cannot find card '0'
%|ALSA lib conf.c:4732:(\_snd_config_evaluate) function snd_func_card_driver returned error: No such file or directory
%|ALSA lib confmisc.c:392:(snd_func_concat) error evaluating strings
%|ALSA lib conf.c:4732:(\_snd_config_evaluate) function snd_func_concat returned error: No such file or directory
%|ALSA lib confmisc.c:1246:(snd_func_refer) error evaluating name
%|ALSA lib conf.c:4732:(\_snd_config_evaluate) function snd_func_refer returned error: No such file or directory
%|ALSA lib conf.c:5220:(snd_config_expand) Evaluate error: No such file or directory
%|ALSA lib pcm.c:2642:(snd_pcm_open_noupdate) Unknown PCM default
%|Playback open error: -2,No such file or directory
{% endShell %}

Well that's a lot of error. Googling for the solution yielded not much information, but somebody suggests something about permission.
Naturally I tried `sudo`ing it

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

Less error (yay), but still error-ing. Also `sudo`ing whenever you have to play audio makes no sense.
Googling some more send me to this [stackoverflow answer](https://askubuntu.com/questions/8362/setting-up-audio-on-a-server-install).

There is two things I need to do now:
- Put my user into the `audio` group: `sudo chmod -aG audio $USER`
- Select the correct sound card for `speaker-test`. 
I found out about this after fumbling around with `aplay -l` and it's fuller version `aplay -L` and the `speaker-test` man page.
In a nutshell, look for the default, non-HDMI device:
 
{% Shell %}
aplay -L
%|...
%|default:CARD=PCH
%|    HDA Intel PCH, ALC3226 Analog
%|    Default Audio Device
%|...
%|
speaker-test -Ddefault:PCH # the part that goes after CARD= above
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
I came to the conclusion that the volume is probably muted, and proceed to try to unmute it.
Unfortunately, the hardware volume button of the laptop won't work on the Ubuntu Server installation, so we need to use
`alsamixer`. Try `alsamixer -c0`, `alsamixer -c1` until you find the correct controller for the soundcard.

{% Image "spotifyd/alsamixer.png", "The TUI of AlsaMixer" %}

Use arrow keys, move it to any muted slider and press `M` to unmute it.
Then I reran the `speaker-test -Ddefault:PCH` command one last time, and sweet pink noise start to fill up both of my ears.

## The Software