---
layout: blog_page_layout.njk
title: How to set up a simple on-premise server system with Docker Swarm.
tags:
  - foss
  - writeUp
---

My mate and me, we are opening a startup. Totally from scratch.

There are a bunch of difficulties when you are building a _technical_ startup from scratch.
One of them is the task of deploying applications efficiently, both in respect of cost and time.

If you are in the software development scene for long enough,
most of the time the answer for deploying these applications "just throw it on AWS and call it a day".
I myself have no problem with AWS itself, or any cloud provider in general.
AWS does have its own use case, but for most of the time, they are geared towards medium to large business.

Then I came across [this post about maintaining your own server](https://www.pietrorea.com/2022/01/28/reclaiming-the-lost-art-of-linux-server-administration),
and I thought to myself, why not actually do that.
Turns out, running your own Linux server system can be quite a lot of fun for a programmer,
and embarking on such a journey will teach you a lot about IT system,
even if you are not planning to be a full-time sysadmin.

## Setting up hardware

The beautiful thing about a small server setup is that you can reuse old hardware lying around on your office.
Our team first server is an old Dell Latitude laptop with a broken keyboard,
which will eventually serves as the manager node and gateway server.
I install Ubuntu Server on it, because it is a kinda sane option for a Linux server that I interact with for most of the
time.

## Containerization setup

Since we are deploying a lot of applications for internal operations, containerization is a must.
To be fair, I can't even imagine how people back in the olden day handle the environment issues for applications.

### Docker

Docker is, by far, the most familiar option for a container engine.
There are a few alternatives: [podman](https://podman.io/), [runc](https://github.com/opencontainers/runc).
Each has its own set of pros and cons, and choosing this is probably a matter of technical consideration and choice.
I choose Docker because it comes with another crucial component in my setup: Docker Swarm.

To install Docker on Ubuntu Server (or any supported Linux distro, or Mac OS), run:
{% Shell %}
curl https://get.docker.com/ | sh # this is to install Docker
sudo usermod -aG docker $USER # run this if you are running a non-root account
{% endShell %}

Restart your shell, and run the following command to check your docker installation:
(this output is recorded in May 2022, by the time you are reading this, the version number
should be very different)
{% Shell %}
docker version
%|Client: Docker Engine - Community
%| Version: 20.10.14
%| API version: 1.41
%| Go version: go1.16.15
%| Git commit: a224086
%| Built: Thu Mar 24 01:48:02 2022
%| OS/Arch: linux/amd64
%| Context: default
%| Experimental: true
%|
%|Server: Docker Engine - Community
%| Engine:
%| Version: 20.10.14
%| API version: 1.41 (minimum version 1.12)
%| Go version: go1.16.15
%| Git commit: 87a90dc
%| Built: Thu Mar 24 01:45:53 2022
%| OS/Arch: linux/amd64
%| Experimental: false
%| containerd:
%| Version: 1.5.11
%| GitCommit: 3df54a852345ae127d1fa3092b95168e4a88e2f8
%| runc:
%| Version: 1.0.3
%| GitCommit: v1.0.3-0-gf46b6ba
%| docker-init:
%| Version: 0.19.0
%| GitCommit: de40ad0
{% endShell %}

### Docker Swarm

Docker Swarm is the simplest container orchestration option you can use for now.
Kubernetes might be a better supported alternative, but for our little cluster,
I pick Docker Swarm's ease of use in exchange for some peace of mind to build our business processes.

Setting up a Docker Swarm is extremely simple
