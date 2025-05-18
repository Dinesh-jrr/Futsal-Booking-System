import 'package:flutter/material.dart';

class OpponentFinderScreen extends StatelessWidget {
  const OpponentFinderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Opponent Finder'),
        backgroundColor: Colors.green,
      ),
      body: const Center(
        child: Text('Opponent Finder Page'),
      ),
    );
  }
}
