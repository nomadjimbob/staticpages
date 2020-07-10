# Static Pages DokuWiki Plugin

## About

`Staticpages` is a plugin for [DokuWiki](http://dokuwiki.org) that allows you to upload static files to the data/staticpages folder to embed in pages


## Features


  * Embeds pages or directories into pages using the `{{staticpages>path}}` tag
  * iFrame height automatically detected to show entire embedded content
  * Override height option for content that is dynamically generated (ie Captivate)
  * Build in file manager for users to manage content


## Configuration

  * `height` : Set the default height of iFrames. When set to 0, the iFrame height is detected using JavaScript
  * Files are stored in data/staticpages directory. The plugin will create this folder automatically provided the data folder has writeable permissions.


## Tags

To embed static content on a wiki page use the tag `{{staticpages>path}}` using the path of the file/folder within the data/staticpages directory.

You can override the height of the iFrame by adding height=X. When no units are included, the default unit used is px.


## Releases

  * ***Current***
    * Initial release


## Issues

  * When using a directory in the staticpages tag, the default page displayed is dependant on your webserver configuration
  * Directory listings within pages are only support if your .htaccess for the site is configured correctly. You will also need to change the .htaccess file within the data/staticpages directory to allow Indexes. StaticPages disables Indexes within the data/staticpages by default
  * ../ is automatically stripped from the staticpages tag as a security measure to prevent listing files outside of the data/staticpages directory


## Support

  * If you think you have found a problem, or would like to see a feature, please [open an issue](https://github.com/nomadjimbob/staticpages/issues)
  * If you are a coder, feel free to create a pull request, but please be detailed about your changes!
