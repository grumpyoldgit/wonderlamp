difference() {
    cube([38.575, 83.575, 21]); // main box
    translate([5,5,3]) cube([28.575,73.575,19]); // inside of box
    translate([11, 0,0]) cube([16.5,22,9]); // space for ethernet connector
    translate([3,3,21-0.75]) cube([32.575,77.575,0.75]); // top of ledge
    translate([3,3,3]) cube ([32.575,77.575,16]); // bottom of ledge
}
