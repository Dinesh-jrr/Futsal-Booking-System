import 'package:flutter/material.dart';
import 'package:player/core/config/theme/app_theme.dart';
//import 'package:user/presentation/Main_Pages/HomePage/homePage.dart';
import 'package:player/presentation/splash/pages/splash.dart';
import 'package:player/presentation/Main_Pages/navbar_roots.dart';
import 'package:player/presentation/auth/pages/signin.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      // Initial page (Splash Page)
      home: const SplashPage(),
      
      // Define named routes for navigation
      routes: {
        '/home': (context) => const Navbar(), 
        '/signin': (context) => const SignIn(),
      },

     
    );
  }
}