import { Ionicons } from "@expo/vector-icons";
import ConfirmModal from "@src/components/common/ConfirmModal";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  useDeleteAlbum,
  useMyAlbums,
  useRenameAlbum,
} from "services/album/hook";

export default function MyAlbumsScreen() {
  const { data: albums, loading, userId, reload } = useMyAlbums();
  const insets = useSafeAreaInsets();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempName, setTempName] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { rename, loading: renaming } = useRenameAlbum(() => reload());
  const { remove, loading: deleting } = useDeleteAlbum(() => reload());

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text className="fontFamily: 'Baloo2-medium'">Đang tải…</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.center}>
        <Text className="fontFamily: 'Baloo2-medium'">Chưa đăng nhập.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingLeft: Math.max(16, insets.left + 12),
          paddingRight: Math.max(16, insets.right + 12),
          paddingTop: 8,
        }}
      >
        <View style={styles.headerRow}>
          <Text style={styles.subtitle}>Chọn album để tiếp tục chỉnh sửa</Text>
        </View>
        {albums.length === 0 ? (
          <View style={styles.center}>
            <Text className="fontFamily: 'Baloo2-medium'">
              Chưa có album nào
            </Text>
          </View>
        ) : (
          <FlatList
            data={albums}
            keyExtractor={(it) => String(it.id)}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            renderItem={({ item }) => {
              const locked = !!item.is_ordered;
              const isEditing = editingId === item.id && !locked;
              return (
                <View style={styles.itemRowWrap}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.item,
                      { flex: 1 },
                      pressed && {
                        opacity: 0.9,
                        transform: [{ scale: 0.997 }],
                      },
                      locked && { opacity: 0.85 },
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: "/my-albums/[id]" as any,
                        params: { id: String(item.id) },
                      })
                    }
                  >
                    <Ionicons name="albums-outline" color="#6b7280" size={18} />
                    {isEditing ? (
                      <TextInput
                        style={styles.nameInput}
                        value={tempName}
                        onChangeText={setTempName}
                        autoFocus
                        placeholder="Nhập tên mới"
                        onSubmitEditing={async () => {
                          const name = tempName.trim();
                          if (!name) return;
                          await rename(item.id, name);
                          setEditingId(null);
                          setTempName("");
                        }}
                        editable={!renaming}
                      />
                    ) : (
                      <Text
                        style={[styles.name, locked && { color: "#6b7280" }]}
                        numberOfLines={1}
                      >
                        {item.name || `Album #${item.id}`}
                      </Text>
                    )}

                    <Ionicons
                      name="chevron-forward"
                      color="#9ca3af"
                      size={18}
                    />
                  </Pressable>

                  <View style={styles.actions}>
                    {isEditing ? (
                      <>
                        <Pressable
                          style={styles.actionBtn}
                          onPress={async () => {
                            const name = tempName.trim();
                            if (!name) {
                              setEditingId(null);
                              setTempName("");
                              return;
                            }
                            await rename(item.id, name);
                            setEditingId(null);
                            setTempName("");
                          }}
                        >
                          <Ionicons
                            name="save-outline"
                            size={20}
                            color="#10B981"
                          />
                        </Pressable>
                        <Pressable
                          style={styles.actionBtn}
                          onPress={() => {
                            setEditingId(null);
                            setTempName("");
                          }}
                        >
                          <Ionicons
                            name="close-outline"
                            size={22}
                            color="#EF4444"
                          />
                        </Pressable>
                      </>
                    ) : locked ? (
                      <View style={styles.lockBadge}>
                        <Ionicons
                          name="lock-closed"
                          size={16}
                          color="#6b7280"
                        />
                        <Text style={styles.lockTxt}>Đã đặt</Text>
                      </View>
                    ) : (
                      <>
                        <Pressable
                          style={styles.actionBtn}
                          onPress={() => {
                            setEditingId(item.id);
                            setTempName(item.name ?? "");
                          }}
                        >
                          <Ionicons
                            name="create-outline"
                            size={20}
                            color="#6B7280"
                          />
                        </Pressable>
                        <Pressable
                          style={styles.actionBtn}
                          onPress={() => setConfirmDeleteId(item.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#EF4444"
                          />
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
      <ConfirmModal
        visible={confirmDeleteId !== null}
        title="Xóa album"
        message={
          "Album và các trang bên trong sẽ biến mất vĩnh viễn.\nHãy chắc chắn trước khi tiếp tục."
        }
        confirmText={deleting ? "Đang xóa…" : "Xóa"}
        cancelText="Hủy"
        loading={deleting}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (confirmDeleteId == null) return;
          await remove(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerRow: { marginBottom: 12 },

  subtitle: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 15,
    fontFamily: "Baloo2-medium",
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.91)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(229, 231, 235, 0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontFamily: "Baloo2-medium",
  },
  itemRowWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(229,231,235,0.6)",
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    fontFamily: "Baloo2-medium",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
  },
  lockBadgeInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lockTxt: { fontSize: 12, color: "#6b7280", fontFamily: "Baloo2-medium" },
});
