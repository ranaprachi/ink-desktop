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

export default function Header({ user, project }) {
  const href = user && user.email ? '/home' : '/login';

  return (
    <Position position="fixed" top="0" left="0" zIndex={1}>
      <Size width="100%">
        <div>
          <div style={{background: '#181818'}}>
            <Size height="60px" width="60px">
              <FlexContainer justifyContent="center" alignItems="center">
                <Link href={href}>
                  <Text color="#fff" size="16px" weight="900" family="Bowlby One">INK</Text>
                </Link>
              </FlexContainer>
            </Size>
          </div>
          {
            user ? (
              <FlexContainer flow="row" justifyContent="space-between" alignItems="center" style={{background: '#181818'}}>
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
            ) : null
          }
        </div>
      </Size>
    </Position>
  );
}
