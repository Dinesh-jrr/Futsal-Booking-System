
import 'package:flutter/material.dart';
import 'package:user/core/config/theme/app_theme.dart';
import 'package:user/presentation/Main_Pages/HomePage.dart';
import 'package:user/presentation/splash/pages/splash.dart';


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
        '/home': (context) => const Homepage(), // Replace with your actual Home page
        // Add other routes here as needed
      },

      // Optionally, you can use onGenerateRoute for dynamic route handling
      // onGenerateRoute: (settings) {
      //   switch (settings.name) {
      //     case '/home':
      //       return MaterialPageRoute(builder: (context) => const HomePage());
      //     default:
      //       return MaterialPageRoute(builder: (context) => const SplashPage());
      //   }
      // },
    );
  }
}
