<?php
/**
 * Dokuwiki Static Pages Plugin
 *
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     James Collins <james.collins@outlook.com.au>
 * @link       https://github.com/nomadjimbon/staticpages
 */

header("Content-Type:application/json");

$json = Array(
    'status'    => 0,
    'message'   => 'An unknown error occured',
);

$path = '../../../data/staticpages';

if(!class_exists('ZipLib')) {
    include_once dirname(__FILE__) . "/ZipLib.class.php";
}


if(!is_dir($path . '/')) {
    if(@mkdir($path . '/', 0755)) {
        file_put_contents($path . '/.htaccess', "order allow,deny\nallow from all\n\nOptions -Indexes");
    } else {
        $err = error_get_last();
        $json['message'] = $err['message'];
        echo json_encode($json);
        return;
    }
}

if(isset($_POST['path'])) {
    if(substr($_POST['path'], 0, 1) != '/') $path .= '/';
    $path .= str_replace('../', '', $_POST['path']);
}

if(isset($_POST['action'])) {
    switch($_POST['action']) {
        case 'upload':
            if(isset($_FILES) && isset($_FILES['file'])) {
                $filename = $_FILES['file']['name'];

                if(isset($_POST['webkitRelativePath']) && $_POST['webkitRelativePath'] != '') {
                    if(!is_dir($path . dirname($_POST['webkitRelativePath']) . '/')) {
                        mkdir($path . dirname($_POST['webkitRelativePath']) . '/', 0755, true);
                    }
                    
                    $filename = $_POST['webkitRelativePath'];
                }

                if(move_uploaded_file($_FILES['file']['tmp_name'], $path . $filename)) {
                    $json['status'] = 1;
                    $json['message'] = 'ok';
                } else {
                    $json['message'] = 'Error uploading the file';
                }
            } else {
                $json['message'] = 'Error uploading the file';
            }

            break;
        case 'ls':
            if(substr($path, -1) != '/') $path .= '/';

            $list = listDir($path);
            $json['files'] = $list;
            $json['path'] = $_POST['path'];

            $json['status'] = 1;
            $json['message'] = 'ok';

            break;
        case 'mkdir':
            if(isset($_POST['name'])) {
                $name = json_decode($_POST['name']);
                if(substr($path, -1) != '/') $path .= '/';

                if(!file_exists($path . $name)) {
                    if(!@mkdir($path . $name, 0755)) {
                        $err = error_get_last();
                        $json['message'] = $err['message'];
                    } else {
                        $json['status'] = 1;
                        $json['message'] = 'ok';
                    }
                } else {
                    $json['message'] = 'Folder already exists ' . $path . $name;
                }
            } else {
                $json['message'] = 'No folder name was given';
            }

            break;
        case 'rm':
            if(isset($_POST['files'])) {
                $files = json_decode($_POST['files']);
                $errors = '';

                if($files != null) {
                    foreach($files as $file) {
                        if(substr($file, -1) == '/') {
                            rrmdir($path . $file);
                        } else {
                            if(!@unlink($path . $file)) {
                                $err = error_get_last();
                                $errors = 'Error deleting file "' . $path . $file . '": ' . $err['message'] . "\n";
                            }    
                        }
                    }

                    if($errors == '') {
                        $json['status'] = 1;
                        $json['message'] = 'ok';
                    } else {
                        $json['message'] = $errors;
                    }
                }
            }
    }
} else {
    $json['message'] = 'Data was not sent to the server. This can be caused due to file size restrictions';
}

if(isset($_POST['path'])) {

}

echo json_encode($json);


function listDir($path) {
    $aDir = Array();

    if($handle = opendir($path)) {
        while(($file = readdir($handle)) !== FALSE) {
            if(substr($file, 0, 1) !== '.' && file_exists($path . $file)) {
                $aFile = Array();

                $aFile['name'] = $file;
                $aFile['modtime'] = filemtime($path . $file);

                if(is_dir($path . $file)) {
                    $aFile['type'] = 'Folder';
                    $aFile['size'] = 'Folder';
                } else {
                    $aFile['type'] = 'File';
                    $aFile['size'] = filesize($path . $file);
                }

                $aDir[] = $aFile;
            }
        }
    }

    return $aDir;
}

function rrmdir($src) {
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            $full = $src . '/' . $file;
            if ( is_dir($full) ) {
                rrmdir($full);
            }
            else {
                unlink($full);
            }
        }
    }
    closedir($dir);
    rmdir($src);
}


// $target_dir = "uploads/" . $_POST['path'];
// mkdir($target_dir);
// $target_file = $target_dir . basename($_FILES["upload_image"]["name"]);
// if (move_uploaded_file($_FILES["upload_image"]["tmp_name"], $target_file)) {
//   header("Content-Type:application/json");    
//   echo json_encode(
//            array(
//                "status"=>1,
//                "message"=>"The file ". $target_file. " has been uploaded."
//             ));
//     } else {
//       header("Content-Type:application/json");
//       echo json_encode(
//           array("status"=>0,
//           "message"=>"Sorry, there was an error uploading your file."
//         ));
//     }
?>
