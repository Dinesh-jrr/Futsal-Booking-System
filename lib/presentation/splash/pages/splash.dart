import 'package:flutter/material.dart';
import 'package:user/presentation/intro/pages/get_started_screen.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState(){
    super.initState();
    redirect();
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.asset(
            './assets/images/logo.png',
            fit:BoxFit.cover,
          ),
        ),
      )
    );
  }

//comments yet to be added
  //delay the time logo view
  Future<void>redirect() async{
    await Future.delayed(const Duration(seconds:2));
    Navigator.pushReplacement(context,
    MaterialPageRoute(
      builder: (BuildContext context) => const GetStartedScreen()));
  }
}

//splash updated