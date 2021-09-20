# caffeine-react_native
A React Native mobile app for iOS and Android to track your caffeine consumption. This utilizes an implementation of Realm DB to persist data and incorporates a QR Scanner to allow the user to add their caffeinated beverages simply by scanning a UPC barcode. This app utilizes an api provided by upcitemdb for UPC lookups and is limited to 100 calls a day per user.  

# Usage  
1. Download using git or download zip and unpack.  
2. Navigate to the directory and open a terminal.  
3. Install Dependencies:  
```  
yarn install && cd ios && pod install && cd ..
```  
4. Run:  
```  
npx react-native run-android && npx react-native run-ios
```  

Note: This guide assumes that you are using a Mac and have already install React Native and all of its associated dependencies.  
