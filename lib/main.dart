import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:user/core/config/theme/app_theme.dart';
import 'package:user/presentation/splash/pages/splash.dart';

void main() {
  runApp(const MyApp());
}
//  Future<void> main() async {
//   WidgetsFlutterBinding.ensureInitialized();
//   HydratedBloc.storage = await HydratedStorage.build(
//     storageDirectory: kIsWeb
//         ? HydratedStorageDirectory.web
//         : HydratedStorageDirectory((await getTemporaryDirectory()).path),
//   );
//   runApp(const MyApp());
// }
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme:AppTheme.lightTheme,
      home:const SplashPage(),
    );
}
}

