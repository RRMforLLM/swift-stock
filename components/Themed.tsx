import { ScrollView as DefaultScrollView, ScrollViewProps } from 'react-native';
export type ThemedScrollViewProps = ThemeProps & ScrollViewProps;

export function ScrollView(props: ThemedScrollViewProps) {
  const { style, contentContainerStyle, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return (
    <DefaultScrollView
      style={[{ backgroundColor }, style]}
      contentContainerStyle={contentContainerStyle}
      {...otherProps}
    />
  );
}
export type LogProps = {
  subject: string;
  details?: string;
  deadline?: string;
  style?: any;
  children?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
};

export function Log({ subject, details, deadline, style, children, onPress, onLongPress }: LogProps) {
  const theme = useColorScheme() ?? 'light';
  return (
    <TouchableOpacity
      activeOpacity={onPress || onLongPress ? 0.8 : 1}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        {
          backgroundColor: Colors[theme].background,
          borderColor: Colors[theme].tint,
          borderWidth: 1,
          borderRadius: 8,
          padding: 14,
          marginBottom: 8,
          width: '100%',
          shadowColor: Colors[theme].tint,
          shadowOpacity: 0.08,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        },
        style,
      ]}
      disabled={!onPress && !onLongPress}
    >
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{subject}</Text>
      {details ? <Text style={{ color: Colors[theme].fadedText, marginBottom: 2 }}>{details}</Text> : null}
      {deadline ? <Text style={{ color: Colors[theme].tint, fontSize: 12 }}>Due: {deadline}</Text> : null}
      {children}
    </TouchableOpacity>
  );
}
/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */


import { Text as DefaultText, View as DefaultView, TouchableOpacity, TouchableOpacityProps, Text as RNText, TextInput as RNTextInput, TextInputProps } from 'react-native';
export type InputProps = ThemeProps & TextInputProps & {
  textColor?: string;
  backgroundColor?: string;
};

export function Input(props: InputProps) {
  const { style, lightColor, darkColor, textColor, backgroundColor, ...otherProps } = props;
  const theme = useColorScheme() ?? 'light';
  const bgColor = backgroundColor || useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const txtColor = textColor || Colors[theme].text;
  let placeholderColor = Colors[theme].fadedText;

  return (
    <RNTextInput
      style={[
        {
          backgroundColor: bgColor,
          color: txtColor,
          borderColor: Colors[theme].tint,
          borderWidth: 1,
          borderRadius: 6,
          padding: 10,
        },
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...otherProps}
    />
  );
}
export type ButtonProps = ThemeProps & TouchableOpacityProps & {
  title: string;
  textColor?: string;
  backgroundColor?: string;
};
export function Button(props: ButtonProps) {
  const { title, style, lightColor, darkColor, textColor, backgroundColor, ...otherProps } = props;
  const theme = useColorScheme() ?? 'light';
  const bgColor = backgroundColor || useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  let txtColor = textColor;
  if (!txtColor) {
    if (bgColor === Colors[theme].tint) {
      txtColor = Colors[theme].background;
    } else {
      txtColor = Colors[theme].text;
    }
  }

  return (
    <TouchableOpacity
      style={[{ backgroundColor: bgColor, padding: 12, borderRadius: 6, alignItems: 'center' }, style]}
      {...otherProps}
    >
      <RNText style={{ color: txtColor, fontWeight: 'bold' }}>{title}</RNText>
    </TouchableOpacity>
  );
}

import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
