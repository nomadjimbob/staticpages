<?php
/**
 * Dokuwiki Static Pages Plugin
 *
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     James Collins <james.collins@outlook.com.au>
 * @link       https://github.com/nomadjimbon/staticpages
 */

if (!defined('DOKU_INC')) die();


class admin_plugin_staticpages extends DokuWiki_Admin_Plugin
{
    public function getMenuSort() { return 200; }
    public function forAdminOnly() { return false; }
    public function getMenuText($language) { return $this->getLang('menu_staticpages'); }
    public function handle() { }

    public function html()
    {
        global $INPUT;
        global $lang;
        global $conf;
        global $ID;

        echo '<div id="staticpages">';
            echo $this->locale_xhtml('filemanager');
            echo '<p>&nbsp;</p>';

            echo '<div id="staticuploads"><table><thead><tr><th>File</th><th>Progress</th></tr><tbody></tbody></table><div class="buttons"><a href="#" class="staticpages-button staticpages-button-uploadclose">Close</a></div></div>';

            echo '<div id="staticpages-errors"><ul></ul><div class="buttons"><a href="#" class="staticpages-button staticpages-button-clearerrors">Clear Errors</a></div></div>';

            echo '<div class="staticpages-tools">';
                echo '<div class="staticpages-toolbar">';
                    echo '<a href="#" class="staticpages-button staticpages-button-selectall">Select all</a>';
                    echo '<a href="#" class="staticpages-button staticpages-button-unselectall">Unselect all</a>';
                    echo '<a href="#" class="staticpages-button staticpages-button-invertselection">Invert selection</a>';
                    echo '<a href="#" class="staticpages-button staticpages-button-delete">Delete</a>';
                    echo '<a href="#" class="staticpages-button staticpages-button-createfolder">Create Folder</a>';
                    echo '<a href="#" class="staticpages-button staticpages-button-upload">Upload files</a>';
                echo '</div>';
                echo '<div class="staticpages-status"><span class="text"></span><span class="progress"></span></div>';
            echo '</div>';

            echo '<div class="staticpages-path"></div>';

            echo '<table id="staticpages-files">';
                echo '<thead><th name="name"><input type="checkbox" name="filesall"> Name</th><th name="size">Size</th><th name="modtime">Modified</th><th>Actions</th></thead>';
                echo '<tbody>';

                echo '</tbody>';
            echo '</table>';

            echo '<input id="staticpages-uploadfile" type="file" multiple webkitdirectory hidden style="display:none">';
        echo '</div>';
    }
}
?>
