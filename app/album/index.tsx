// import { useRouter } from "expo-router";
// import React from "react";
// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const albumOptions = [
//   {
//     id: "1",
//     name: "Album mặc định",
//     cover: require("../../assets/images/cover/cover1.png"),
//   },
//   {
//     id: "2",
//     name: "Album kỷ niệm",
//     cover: require("../../assets/images/cover/cover2.png"),
//   },
// ];

// export default function AlbumSelector() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Chọn mẫu Album</Text>
//       <FlatList
//         horizontal
//         pagingEnabled
//         data={albumOptions}
//         keyExtractor={(item) => item.id}
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.item}
//             onPress={() => router.push(`/album/${item.id}`)}
//           >
//             <Image source={item.cover} style={styles.cover} />
//             <Text style={styles.albumName}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", justifyContent: "center" },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   item: { width: 320, alignItems: "center", marginHorizontal: 10 },
//   cover: { width: 300, height: 200, borderRadius: 16 },
//   albumName: { marginTop: 8, fontSize: 16, fontWeight: "500" },
// });
