import React from 'react';
import BuyerCustomHeader from './BuyerCustomHeader';
import CustomHeader from './CustomHeader';
import UesrMob from '../Services/Mobxstate/UesrMob';

interface HeaderSwitcherProps {
  name?: string;
  role?: string;
}

const HeaderSwitcher: React.FC<HeaderSwitcherProps> = ({
  name = UesrMob.user?.user?.name ?? '',
  role = UesrMob.user?.user?.role ?? '',
}) => {
  const safeName = name ?? '';
  const safeRole = role ?? '';

  return safeRole === 'company' ? (
    <BuyerCustomHeader name={safeName} role={safeRole} />
  ) : (
    <CustomHeader name={safeName} role={safeRole} />
  );
};

export default HeaderSwitcher;
