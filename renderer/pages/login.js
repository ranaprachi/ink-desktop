import React, { useCallback } from 'react';
import { withRouter } from 'next/router';
import Head from 'next/head';
import {
  Button,
  Form,
  FormGroup,
} from '@bootstrap-styled/v4';
import useUser from '../effects/useUser';
import Page from '../components/Page';
import Input from '../components/Input';
import FlexContainer from '../components/FlexContainer';
import Space from '../components/Space';
import Size from '../components/Size';
import Text from '../components/Text';
import Position from '../components/Position';
import useInput from '../effects/useInput';
import requestFromWorker from '../lib/requestFromWorker';
import bg from './bg.jpeg';

const Login = ({ router }) => {
  const { user, setUser } = useUser();

  const { value: email, bind: bindEmail, reset: resetEmail } = useInput('');
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput('');

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }

      // TODO call API once platform in place
      const user = await requestFromWorker('set-user', { email, password });
      setUser(user);

      router.push('/home');
    },
    [email, password]
  );

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      <FlexContainer
        fluid={true}
        justifyContent="center" 
        alignItems="center"
        style={{ backgroundImage: `url(${bg})`}}
      >
        <Size height="60px" width="100%">
          <Position position="fixed" top="0">
            <div style={{background: '#181818'}}>
              <FlexContainer fluid={true} justifyContent="center">
                <Space padding="20px 14px">
                  <Text color="#fff" size="16px" weight="900" family="Bowlby One">INK</Text>
                </Space>
              </FlexContainer>
            </div>
          </Position>
        </Size>
        <Text align="center" size="177px" family="Bowlby One" lineHeight="0.85">INK</Text>
        <Space padding="0 0 30px">
          <Text align="center" color="#fadabc" size="22px">TRUSTED MUSIC COLLABORATION</Text>
        </Space>
        <Size width="350px">
          <div>
            <Form onSubmit={handleSubmit}>
              <Space padding="0 0 16px">
                <FormGroup>
                  <Input
                    required
                    type="email"
                    placeholder="Email"
                    size="sm"
                    {...bindEmail}
                  />
                </FormGroup>
              </Space>
              <FormGroup>
                <Input
                  required
                  type="password"
                  placeholder="Password"
                  size="sm"
                  {...bindPassword}
                />
              </FormGroup>
              <Space padding="20px 0">
                <div>
                  <Button type="submit" block>Sign Up</Button>
                </div>
              </Space>
            </Form>
          </div>
        </Size>
      </FlexContainer>
    </Page>
  );
};

export default withRouter(Login);
