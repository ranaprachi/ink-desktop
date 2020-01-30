import styled from 'styled-components';
import gravatar from 'gravatar';
import Link from 'next/link';
import Logo from './Logo';
import { backgroundPanel, buttonInfo } from '../layout/colors';
import ProjectIcon from './ProjectIcon';
import Size from '../components/Size';
import Position from '../components/Position';
import Text from '../components/Text';
import Space from '../components/Space';
import FlexContainer from '../components/FlexContainer';


const UserImage = styled.img`
  width: 45px;
  height: 45px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #ddd;
`;

const LogoutLink = styled(Text)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`
const Header = ({ user }) => (
  <Position position="absolute" zIndex={1}>
    <Size width="100%">
      <FlexContainer flow="row" justifyContent="space-between" alignItems="center" style={{ background: '#181818' }}>
        <Space padding="16px">
          <FlexContainer flow="row" alignItems="center">
            <UserImage src={gravatar.url(user.email)} alt="User" />
            <Text color="#fff">{user.email}</Text>
          </FlexContainer>
        </Space>
        <Space padding="16px">
          <LogoutLink color="#fff">LOGOUT</LogoutLink>
        </Space>
      </FlexContainer>
    </Size>
  </Position>
);

export default Header;
