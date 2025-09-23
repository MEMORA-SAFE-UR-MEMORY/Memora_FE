// import { PageTemplate, useAlbum } from "@src/hooks/album/useAlbum";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React from "react";
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const { width, height } = Dimensions.get("window");
// const aspect = 297 / 210; // A4 ngang

// // định nghĩa template demo
// const templates: PageTemplate[] = [
//   {
//     background: require("../../assets/images/template/page1.png"),
//     slots: [
//       { x: 50, y: 80, w: 120, h: 120 },
//       { x: 220, y: 150, w: 150, h: 150 },
//     ],
//   },
//   {
//     background: require("../../assets/images/template/page2.png"),
//     slots: [{ x: 80, y: 100, w: 200, h: 200 }],
//   },
// ];

// export default function AlbumViewer() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const { pages, confirmed, pickImage, confirmAlbum } = useAlbum(
//     id!,
//     templates
//   );
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <FlatList
//         horizontal
//         pagingEnabled
//         data={pages}
//         keyExtractor={(_, i) => i.toString()}
//         renderItem={({ item, index }) => (
//           <View style={styles.page}>
//             <ImageBackground source={item.background} style={styles.pageBg}>
//               {item.slots.map((slot, i) => (
//                 <TouchableOpacity
//                   key={i}
//                   style={[
//                     styles.slot,
//                     {
//                       left: slot.x,
//                       top: slot.y,
//                       width: slot.w,
//                       height: slot.h,
//                     },
//                   ]}
//                   onPress={() => pickImage(index, i)}
//                 >
//                   {slot.uri ? (
//                     <Image
//                       source={{ uri: slot.uri }}
//                       style={{ width: "100%", height: "100%" }}
//                     />
//                   ) : (
//                     <Text style={styles.placeholder}>+</Text>
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ImageBackground>
//           </View>
//         )}
//       />

//       <View style={styles.footer}>
//         {!confirmed ? (
//           <TouchableOpacity style={styles.btn} onPress={confirmAlbum}>
//             <Text style={styles.btnText}>Xác nhận Album</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             style={[styles.btn, { backgroundColor: "#4CAF50" }]}
//             onPress={() => router.push("/payment")}
//           >
//             <Text style={styles.btnText}>Thanh toán</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f5f5f5" },
//   page: {
//     width: width,
//     height: width / aspect,
//     backgroundColor: "#fff",
//   },
//   pageBg: { flex: 1, resizeMode: "cover" },
//   slot: {
//     position: "absolute",
//     borderWidth: 1,
//     borderColor: "#aaa",
//     borderStyle: "dashed",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholder: { color: "#888", fontSize: 20, fontWeight: "bold" },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   btn: {
//     backgroundColor: "#2196F3",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//   },
//   btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
// });
