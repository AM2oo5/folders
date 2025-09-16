<!DOCTYPE html>
<html>
<body>

<?php

$file = fopen("LE.txt","r");
print_r(fgetcsv($file));
fclose($file);

?>

</body>
</html>