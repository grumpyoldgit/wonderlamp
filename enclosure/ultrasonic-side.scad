difference() {
    cube([38.575, 83.575, 20]); // main box
    translate([5,5,3]) cube([28.575,75.575,17]); // inside of box (with one side off for sensor)
    translate([2.5,2.5,20-0.75]) cube([33.575,78.575,0.75]); // top of ledge
    translate([3,3,3]) cube ([32.575,77.575,14]); // bottom of ledge
    translate([16+3,83.757-13-3,0]) cylinder(d=17.2, h=4); // hole for ultrasonic
    translate([38.575/2,0,20/2]) rotate([-90,0,0]) cylinder (d=13, h=4); // hole for power connector
}