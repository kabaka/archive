import * as React from 'react';
import { Flex, Button } from '@fluentui/react-northstar';
// import { SkypeLogoIcon } from '@fluentui/react-icons-northstar';
// <Button content="Logo" icon={<SkypeLogoIcon />} />

const NavBar = () => (
  <Flex gap="gap.small">
    <Button content="Logo" />

    <Flex.Item push>
      <Button content="Page 1" />
    </Flex.Item>

    <Button content="Page 2" />
    <Button content="Page 3" />
  </Flex>
);

export default NavBar;