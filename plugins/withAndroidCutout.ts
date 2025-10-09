import { ConfigPlugin, withAndroidStyles } from "@expo/config-plugins";

const withAndroidCutout: ConfigPlugin = (config) =>
  withAndroidStyles(config, (c) => {
    const styles = c.modResults;
    const stylesArr = styles.resources.style ?? [];
    const appTheme = stylesArr.find((s: any) => s.$?.name === "AppTheme");
    if (appTheme) {
      appTheme.item = appTheme.item ?? [];
      const exists = appTheme.item.some(
        (it: any) => it.$?.name === "android:windowLayoutInDisplayCutoutMode"
      );
      if (!exists) {
        appTheme.item.push({
          _: "shortEdges",
          $: { name: "android:windowLayoutInDisplayCutoutMode" },
        });
      }
    }
    return c;
  });

export default withAndroidCutout;
