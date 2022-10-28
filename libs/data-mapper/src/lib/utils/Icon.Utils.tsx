import type { FunctionGroupBranding } from '../constants/FunctionConstants';
import { Collection20Regular, StringCategory20Regular } from '../images/CategoryIcons';
import {
  Any16Filled,
  Any16Regular,
  Array16Filled,
  Array16Regular,
  Binary16Filled,
  Binary16Regular,
  Decimal16Filled,
  Decimal16Regular,
  Integer16Filled,
  Integer16Regular,
  String16Filled,
  String16Regular,
} from '../images/DataType16Icons';
import {
  Any24Filled,
  Any24Regular,
  Array24Filled,
  Array24Regular,
  Binary24Filled,
  Binary24Regular,
  Decimal24Filled,
  Decimal24Regular,
  Integer24Filled,
  Integer24Regular,
  String24Filled,
  String24Regular,
} from '../images/DataType24Icons';
import { FunctionCategory } from '../models/Function';
import { NormalizedDataType, SchemaNodeDataType, SchemaNodeProperties } from '../models/Schema';
import { Image } from '@fluentui/react-components';
import {
  AddSubtractCircle16Filled,
  AddSubtractCircle16Regular,
  AddSubtractCircle20Filled,
  AddSubtractCircle24Filled,
  AddSubtractCircle24Regular,
  bundleIcon,
  CalendarClock16Filled,
  CalendarClock16Regular,
  CalendarClock20Regular,
  CalendarClock24Filled,
  CalendarClock24Regular,
  CircleOff16Filled,
  CircleOff16Regular,
  Cube16Filled,
  Cube16Regular,
  Cube24Filled,
  Cube24Regular,
  MathSymbols20Regular,
  Wrench20Regular,
} from '@fluentui/react-icons';

type iconSize = 16 | 24;

export const iconForNormalizedDataType = (nodeType: NormalizedDataType, size: iconSize, bundled: boolean) => {
  let convertedType: SchemaNodeDataType = SchemaNodeDataType.AnyAtomicType;

  switch (nodeType) {
    case NormalizedDataType.Any:
      break;
    case NormalizedDataType.Binary:
      convertedType = SchemaNodeDataType.Base64Binary;
      break;
    case NormalizedDataType.Boolean:
      convertedType = SchemaNodeDataType.Boolean;
      break;
    case NormalizedDataType.ComplexType:
      convertedType = SchemaNodeDataType.None;
      break;
    case NormalizedDataType.DateTime:
      convertedType = SchemaNodeDataType.DateTime;
      break;
    case NormalizedDataType.Decimal:
      convertedType = SchemaNodeDataType.Decimal;
      break;
    case NormalizedDataType.Integer:
    case NormalizedDataType.Number:
      convertedType = SchemaNodeDataType.Integer;
      break;
    case NormalizedDataType.String:
      convertedType = SchemaNodeDataType.String;
      break;
    default:
      console.error(`Icon.Utils Error: No corresponding SchemaNodeDataType found for NormalizedDataType ${nodeType}`);
  }

  return iconForSchemaNodeDataType(convertedType, size, bundled);
};

export const iconForSchemaNodeDataType = (
  nodeType: SchemaNodeDataType,
  size: iconSize,
  bundled: boolean,
  properties?: SchemaNodeProperties
) => {
  let icons: typeof Integer16Regular[] = [];

  switch (nodeType) {
    /* Currently Unused will come into play with JSON
    case SchemaNodeDataType.ComplexType: {
      // Number
      icons = size === 16 ? [NumberSymbol16Regular, NumberSymbol16Filled] : [NumberSymbol24Regular, NumberSymbol24Filled];
      break;
    }
    */
    case SchemaNodeDataType.Int:
    case SchemaNodeDataType.Integer:
    case SchemaNodeDataType.Long:
    case SchemaNodeDataType.NegativeInteger:
    case SchemaNodeDataType.NonNegativeInteger:
    case SchemaNodeDataType.NonPositiveInteger:
    case SchemaNodeDataType.PositiveInteger:
    case SchemaNodeDataType.Short:
    case SchemaNodeDataType.UnsignedInt:
    case SchemaNodeDataType.UnsignedLong:
    case SchemaNodeDataType.UnsignedShort: {
      // Integer
      icons = size === 16 ? [Integer16Regular, Integer16Filled] : [Integer24Regular, Integer24Filled];
      break;
    }
    case SchemaNodeDataType.Decimal:
    case SchemaNodeDataType.Double:
    case SchemaNodeDataType.Float: {
      // Decimal
      icons = size === 16 ? [Decimal16Regular, Decimal16Filled] : [Decimal24Regular, Decimal24Filled];
      break;
    }
    case SchemaNodeDataType.Base64Binary:
    case SchemaNodeDataType.Byte:
    case SchemaNodeDataType.HexBinary:
    case SchemaNodeDataType.UnsignedByte: {
      // Binary
      icons = size === 16 ? [Binary16Regular, Binary16Filled] : [Binary24Regular, Binary24Filled];
      break;
    }
    case SchemaNodeDataType.Boolean: {
      // Boolean
      icons =
        size === 16 ? [AddSubtractCircle16Regular, AddSubtractCircle16Filled] : [AddSubtractCircle24Regular, AddSubtractCircle24Filled];
      break;
    }
    case SchemaNodeDataType.AnyUri:
    case SchemaNodeDataType.Id:
    case SchemaNodeDataType.Idref:
    case SchemaNodeDataType.Language:
    case SchemaNodeDataType.Name:
    case SchemaNodeDataType.NCName:
    case SchemaNodeDataType.NmToken:
    case SchemaNodeDataType.NormalizedString:
    case SchemaNodeDataType.QName:
    case SchemaNodeDataType.String:
    case SchemaNodeDataType.Token: {
      // String
      icons = size === 16 ? [String16Regular, String16Filled] : [String24Regular, String24Filled];
      break;
    }
    case SchemaNodeDataType.Date:
    case SchemaNodeDataType.DateTime:
    case SchemaNodeDataType.Duration:
    case SchemaNodeDataType.GDay:
    case SchemaNodeDataType.GMonth:
    case SchemaNodeDataType.GMonthDay:
    case SchemaNodeDataType.GYear:
    case SchemaNodeDataType.GYearMonth:
    case SchemaNodeDataType.Time: {
      // Date time
      icons = size === 16 ? [CalendarClock16Regular, CalendarClock16Filled] : [CalendarClock24Regular, CalendarClock24Filled];
      break;
    }
    case SchemaNodeDataType.Entity:
    case SchemaNodeDataType.None: {
      // Object | Array
      if (properties === SchemaNodeProperties.Repeating) {
        icons = size === 16 ? [Array16Regular, Array16Filled] : [Array24Regular, Array24Filled];
      } else {
        icons = size === 16 ? [Cube16Regular, Cube16Filled] : [Cube24Regular, Cube24Filled];
      }
      break;
    }
    case SchemaNodeDataType.AnyAtomicType:
    case SchemaNodeDataType.Item:
    case SchemaNodeDataType.Notation:
    case SchemaNodeDataType.UntypedAtomic: {
      // Any
      icons = size === 16 ? [Any16Regular, Any16Filled] : [Any24Regular, Any24Filled];
      break;
    }
    default: {
      console.error(`Icon.Utils Error: No icon found for type ${nodeType}`);

      // Null
      icons = [CircleOff16Regular, CircleOff16Filled];
      break;
    }
  }

  return bundled ? bundleIcon(icons[1], icons[0]) : icons[0];
};

export const iconForFunctionCategory = (functionCategory: FunctionCategory) => {
  switch (functionCategory) {
    case FunctionCategory.Collection: {
      return Collection20Regular;
    }
    case FunctionCategory.DateTime: {
      return CalendarClock20Regular;
    }
    case FunctionCategory.Logical: {
      return AddSubtractCircle20Filled;
    }
    case FunctionCategory.Math: {
      return MathSymbols20Regular;
    }
    case FunctionCategory.String: {
      return StringCategory20Regular;
    }
    case FunctionCategory.Utility: {
      return Wrench20Regular;
    }
    default: {
      console.error(`Invalid category type: ${functionCategory}`);
      return Wrench20Regular;
    }
  }
};

export const iconUriForIconImageName = (iconImageName: string) => {
  // TODO Temp CDN, will need to be moved into a production location
  return `https://datamappericons.azureedge.net/icons/${iconImageName}`;
};

export const getIconForFunction = (name: string, fileName: string | undefined, branding: FunctionGroupBranding) => {
  return fileName ? <Image src={iconUriForIconImageName(fileName)} height={20} width={20} alt={name} /> : <>{branding.icon}</>;
};
