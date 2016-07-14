difference() {
    cube([38.575, 83.575, 21]); // main box
    translate([5,5,3]) cube([28.575,73.575,19]); // inside of box
    translate([11, 0,0]) cube([16.5,26.8-1.4,7.5]); // space for ethernet connector
    translate([2.5,2.5,21-0.75]) cube([33.575,78.575,0.75]); // top of ledge
    translate([3,3,3]) cube ([32.575,77.575,16]); // bottom of ledge
    translate([5,5+73.575,19]) cube ([28.575,2,4]); // solder space
}