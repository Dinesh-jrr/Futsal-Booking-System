import 'package:flutter/material.dart';
import 'package:user/core/config/theme/app_colors.dart';
import 'package:user/presentation/Main_Pages/HomePage.dart';

class Navbar extends StatefulWidget {
  const Navbar({super.key});

  @override
  State<Navbar> createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {

  int _selectedIndex=0;
  final _screens=[
    //home screen
    HomePage(),
    //bookings screen
    Container(),
    //chat screen
    Container(),
    //profile screen
    Container()
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: _screens[_selectedIndex],
        bottomNavigationBar: Container(
          height: 80,
          child: BottomNavigationBar(
            backgroundColor: Colors.white,
            type:BottomNavigationBarType.fixed,
            selectedItemColor: AppColors.primary,
            unselectedItemColor: Colors.black26,
            selectedLabelStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 15,
            ),
              currentIndex:_selectedIndex,
              onTap:(index){
                setState(() {
                  _selectedIndex=index;
                });
              },
              items:const [
                BottomNavigationBarItem(icon: Icon(Icons.home_filled),
                label:'Home',
                ),
                BottomNavigationBarItem(icon: Icon(Icons.home_filled),
                label:'Bookings',
                ),
                BottomNavigationBarItem(icon: Icon(Icons.home_filled),
                label:'Chat',
                ),
                BottomNavigationBarItem(icon: Icon(Icons.home_filled),
                label:'Account',
                ),
              ]
  
            ),

            
        ),
    );
  }
}