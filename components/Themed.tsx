import { Modal as RNModal } from 'react-native';

export type ModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  style?: any;
};

export function Modal({ visible, onRequestClose, children, transparent = true, animationType = 'fade', style }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      onRequestClose={onRequestClose}
      transparent={transparent}
      animationType={animationType}
    >
      <DefaultView style={[{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      }, style]}>
        {children}
      </DefaultView>
    </RNModal>
  );
}
export type MenuProps = {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  style?: any;
};

export function Menu({ label, value, options, onChange, style }: MenuProps) {
  const theme = useColorScheme() ?? 'light';
  const [open, setOpen] = React.useState(false);
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      {label && <DefaultText style={{ marginBottom: 4 }}>{label}</DefaultText>}
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: Colors[theme].background,
          borderColor: Colors[theme].tint,
          borderWidth: 1,
          borderRadius: 6,
        }}
        onPress={() => setOpen((o) => !o)}
        activeOpacity={0.8}
      >
        <DefaultText style={{ color: Colors[theme].text }}>{options.find(o => o.value === value)?.label || 'Seleccionar...'}</DefaultText>
      </TouchableOpacity>
      {open && (
        <View style={{
          backgroundColor: Colors[theme].background,
          borderColor: Colors[theme].tint,
          borderWidth: 1,
          borderRadius: 6,
          marginTop: 4,
          zIndex: 10,
        }}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={{ padding: 10, backgroundColor: value === opt.value ? Colors[theme].tint : 'transparent' }}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <DefaultText style={{ color: value === opt.value ? Colors[theme].background : Colors[theme].text }}>{opt.label}</DefaultText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
// Choice component: input with two options
export type ChoiceProps = {
  label?: string;
  value: string;
  optionA: string;
  optionB: string;
  onChange: (val: string) => void;
  style?: any;
};

export function Choice({ label, value, optionA, optionB, onChange, style }: ChoiceProps) {
  const theme = useColorScheme() ?? 'light';
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      {label && <DefaultText style={{ marginBottom: 4 }}>{label}</DefaultText>}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: value === optionA ? Colors[theme].tint : Colors[theme].background,
            borderColor: Colors[theme].tint,
            borderWidth: 1,
            borderRadius: 6,
            marginRight: 6,
            alignItems: 'center',
          }}
          onPress={() => onChange(optionA)}
        >
          <DefaultText style={{ color: value === optionA ? Colors[theme].background : Colors[theme].text }}>{optionA}</DefaultText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: value === optionB ? Colors[theme].tint : Colors[theme].background,
            borderColor: Colors[theme].tint,
            borderWidth: 1,
            borderRadius: 6,
            marginLeft: 6,
            alignItems: 'center',
          }}
          onPress={() => onChange(optionB)}
        >
          <DefaultText style={{ color: value === optionB ? Colors[theme].background : Colors[theme].text }}>{optionB}</DefaultText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
import React from 'react';
import { StyleSheet } from 'react-native';

export type StoreProps = {
  name: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
};

export function Store({ name, onPress, onLongPress, style }: StoreProps) {
  const theme = useColorScheme() ?? 'light';
  return (
    <TouchableOpacity
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
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}
    >
      <DefaultText style={{ fontWeight: 'bold', fontSize: 16 }}>{name}</DefaultText>
    </TouchableOpacity>
  );
}
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
  type: string;
  concept?: string;
  uniform?: string;
  quantity?: number;
  date?: string;
  style?: any;
  children?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
};

export function Log({ type, concept, uniform, quantity, date, style, children, onPress, onLongPress }: LogProps) {
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
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 2 }}>{type}</Text>
      {concept && <Text style={{ color: Colors[theme].fadedText, marginBottom: 2 }}>Concepto: {concept}</Text>}
      {uniform && <Text style={{ color: Colors[theme].text, marginBottom: 2 }}>Uniforme: {uniform}</Text>}
      {typeof quantity === 'number' && <Text style={{ color: Colors[theme].text, marginBottom: 2 }}>Cantidad: {quantity}</Text>}
      {date && <Text style={{ color: Colors[theme].tint, fontSize: 12, marginBottom: 2 }}>Fecha: {date}</Text>}
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
