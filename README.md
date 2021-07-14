<div align="center">

# gitrc

<small><em>easily switch between `.gitconfig` files</em></small>

![Github2npm](https://github.com/markbattistella/gitrc/workflows/gh2npm/badge.svg?event=registry_package) ![npm (scoped)](https://img.shields.io/npm/v/@markbattistella/gitrc) ![GitHub](https://img.shields.io/github/license/markbattistella/gitrc)

---

[![](https://img.shields.io/badge/%20-@markbattistella-blue?logo=paypal&style=for-the-badge)](https://www.paypal.me/markbattistella/6AUD) [![](https://img.shields.io/badge/%20-buymeacoffee-black?logo=buy-me-a-coffee&style=for-the-badge)](https://www.buymeacoffee.com/markbattistella)

</div>

---

## Overview

If you (like me) need to travel between home and the office that have different network settings you'll know how annoying setting and unsetting config settings can be - especially if you try and push and it fails.

It works really great if one `.gitconfig` needs a proxy, and the other doesn't.

> Major credit to [@deoxxa/npmrc](https://github.com/deoxxa/npmrc) for inspiration and setting a blueprint

## Installation

1. Install the module from `npm`

    ```sh
    npm i @markbattistella/gitrc -g
    ```

## Usage

```sh
$ gitrc -h

Usage:
  gitrc               List all profiles
  gitrc [name]        Switch to profile
  gitrc -n [name]     Create a new profile
  gitrc -d [name]     Delete the profile
  gitrc -h            Display this screen
```

### Initialisation

Calling `gitrc` without arguments creates an `~/.gitconfigs/` directory if it doesn't exist, and copies your current `~/.gitconfig` as the 'default' .gitconfig profile.

### Create a new config file

```sh
gitrc -n configname
```

A blank config will be created where you can have custom settings for your `.gitconfig`

```sh
git config --global user.name "Mark Battistella"
git config --global user.email markb@example.com
```

You can then add whatever other configuration settings you need. Please [refer to the manual](https://www.git-scm.com/book/en/v2/Customizing-Git-Git-Configuration) for help.

### List available config files

```sh
Available .gitconfig files:

 > home
   work-proxy
```

### Switch to a specific .gitconfig

```sh
gitrc work-proxy
Activating .gitconfig 'work-proxy'
```

### Delete a specific .gitconfig

```sh
gitrc -d work-proxy

Deleting .gitconfig file 'work-proxy'
Current active config is being deleted.
Remember to set a new one before use.
```

## Note For Windows Users

You may have to run `gitrc` in a shell (cmd, PowerShell, Git Bash, etc) with
elevated (Administrative) privileges to get it to run.

## License

MIT - a copy is included with the source.

## Contact

- GitHub ([markbattistella](https://github.com/markbattistella))
- Twitter ([@markbattistella](http://twitter.com/markbattistella))

## Awesome People

Again I want to thank:

- Conrad ([github](https://github.com/deoxxa/)) - *author of npmrc*

And all the people that helped on that project:

- Jaime "the binary wizard" Pillora ([github](https://github.com/jpillora))
- Tim "two hands" Oxley ([github](https://github.com/timoxley))
- Jakob "fastest blur in the west" Krigovsky ([github](https://github.com/SonicHedgehog))
- Rod "the destroyer" Vagg ([github](https://github.com/rvagg))
- Eugene "ludicrous gibs" Asiedu ([github](https://github.com/ngenerio))

## Contributing

1. Clone the repo:

    `git clone https://github.com/markbattistella/gitrc.git`

1. Create your feature branch:

    `git checkout -b my-feature`

1. Commit your changes:

    `git commit -am 'Add some feature'`

1. `Push` to the branch:

    `git push origin my-new-feature`

1. Submit the `pull` request
