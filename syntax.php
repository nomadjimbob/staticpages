<?php
/**
 * Dokuwiki Static Pages Plugin
 * 
 * Displays a static page from /data/staticpages directory
 * Usage {{staticpages>path}}
 *
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     James Collins <james.collins@outlook.com.au>
 * @link       https://github.com/nomadjimbon/staticpages
 */
if (!defined('DOKU_INC')) die();

if (!defined('DOKU_LF')) define('DOKU_LF', "\n");
if (!defined('DOKU_TAB')) define('DOKU_TAB', "\t");
if (!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');

class syntax_plugin_staticpages extends DokuWiki_Syntax_Plugin {

    function getType() { return 'substition'; }
    function getSort() { return 305; }
    function getPType() { return 'block';}
    function connectTo($mode) {
        $this->Lexer->addSpecialPattern('\{\{staticpages>.*?\}\}', $mode, 'plugin_staticpages');
    }

    function handle($match, $state, $pos, Doku_Handler $handler) {
        $tags = trim(substr($match, 14, -2));
        $tags = preg_replace(array('/[[:blank:]]+/', '/\s+/'), " ", $tags);

        if (!$tags) return false;
        
        return $tags;
    }

    function render($mode, Doku_Renderer $renderer, $data) {
        if ($data === false) return false;

        if ($mode == 'xhtml') {
            $data = explode(' ', $data);
            $uri = $data[0];
            $height = '';

            foreach($data as $opt) {
                if(strcasecmp('height=', substr($opt, 0, 7)) == 0) {
                    $height = substr($opt, 7);
                }
            }

            if($height != '') {
                if((stripos($height, 'auto') === FALSE) && (stripos($height, 'dynamic') === FALSE)) {
                    if(stripos($height, 'px') === FALSE) {
                        if(strpos($height, '%') === FALSE) $height .= 'px';
                    }
                } else {
                    $height = '';
                }
            }

            $renderer->doc .= '<iframe src="/data/staticpages/' . $uri . '" class="staticpages-frame"' . ($height != '' ? ' style="height:' . $height . '"' : '') . '></iframe>';
            return true;

        }
        return false;
    }
}
