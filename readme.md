# magic-circle
Magic Circle is an Owlbear Rodeo extension that provides an RPC interface to external applications, and an interface for acting on incoming messages to other interested OBR extensions. In short this provides the ability to:
 - write extensions that accept die rolls from any source in a standardized format, without worrying about the particulars of supporting those sources themselves
 - bridge Owlbear and another program, for instance a Discord bot
 - script Owlbear scene modifications, such as item visibility or position

## Setup
 1. Install the extension located at https://magic-circle.owlbear.snail.moe/manifest.json
 2. Click the Magic Circle icon on your action bar and click "New Source"
     - If you're using [ob-remote](https://github.com/snailington/ob-remote) or another source that provides an import string, click import
     - If you're using Beyond20, click manual and change the source type to Beyond20
 3. After all sources are configured, you may want to install the [stealth mode](https://magic-circle.owlbear.snail.moe/stealth.json) version to run the dispatcher without having an extra button on your bar.  You will likely need to refresh Owlbear to changeover.

## Compatible Extensions
 - **[Sending Stones](https://github.com/snailington/sending-stones)**: Proof of concept but reasonably functional message log

## Compatible Sources
 - **[ob-remote](https://github.com/snailington/ob-remote)**: CLI program for remotely controlling Owlbear Rodeo via RPC. Includes a D&D Beyond campaign log proxy.
 - **[Beyond20](https://github.com/gludington/Beyond20)**: (by way of gludington's fork that adds Owlbear support) Browser extension for D&D Beyond.

## Want To Know More?
If you want to integrate Magic Circle into your extension, or write a source to feed events into Owlbear, its easy (I hope)! Head over to the repo for the client API https://github.com/snailington/magic-circle-api. Also hit me up on discord @ snail#5590
