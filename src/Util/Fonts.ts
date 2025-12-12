import { ms, s  } from "react-native-size-matters";
import COLORS from "./Colors";


const fontTypes = {
    base: 'Inter_Regular',
};
const size = {
    h1: s(36),
    h2: s(24),
    h3: s(20),
    medium: s(18),
    regular:s(16),
    small: s(14),
    xsmall:s(12),
    ssmall:s(10),
    error: s(10),
    tiny: s(6),
  };
  const FontStyle = {
    otpSubTitle:{
      fontFamily: fontTypes.base,
      fontSize: ms(15),
      height:30,
    },
    regTextTitle:{
      fontFamily: fontTypes.base,
      fontSize: 18,
      height:30,
    },
    Logintitle:{
      fontFamily: fontTypes.base,
      fontSize: 20,
      color:COLORS.black,
      height:30,
      fontWeight: '700',
    },
    TextFilter20:{
      fontFamily: fontTypes.base,
      fontSize: 20,
      fontWeight: '600',
      color:COLORS.black,
    },
    TabMain16:{
      fontFamily: fontTypes.base,
      fontSize: 16,
      color:COLORS.black,
    },
    TextTagB12px:{
      fontFamily: fontTypes.base,
      fontSize: 12,
      fontWeight: '800',
      color:'#FFFFFF',
    },
    TextB14px:{
      fontFamily: fontTypes.base,
      fontSize: 14,
      fontWeight: '600',
      color:'#4A4A4A',
    },
    Text12px:{
      fontFamily: fontTypes.base,
      fontSize: 12,
      fontWeight: '400',
      color:'#4A4A4A',
    },
    Text14px:{
      fontFamily: fontTypes.base,
      fontSize: 14,
      fontWeight: '400',
      color:'#4A4A4A',
    },
    TextFont:{
      fontFamily: fontTypes.base,
    },
    TitleMain24:{
      fontFamily: fontTypes.base,
      fontSize: 26,
      color:COLORS.black,
      height:30,
      fontWeight: 'bold',
    },
    TitleMain20:{
      fontFamily: fontTypes.base,
      fontSize: 20,
      color:COLORS.black,
    },
    TitleMain16:{
      fontFamily: fontTypes.base,
      fontSize: 16,
      color:COLORS.black,
    },
    SSBtntitle:{
      fontFamily: fontTypes.base,
      fontSize: 18,
      fontWeight:'600',
      alignSelf:'center',
      justifyContent:'center',
      lineHeight:56,
      color:COLORS.white
  },
  SSinputTitle:{
    fontFamily: fontTypes.base,
    fontSize: size.xsmall,
    color:'#6D6D78',
}
}


  export default {fontTypes,size,FontStyle}

