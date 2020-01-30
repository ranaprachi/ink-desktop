import { remote } from 'electron';
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Input from '../components/Input';
import styled from 'styled-components';
import { Row, Col, H5, Button, Container } from '@bootstrap-styled/v4';
import { complementarySecondary } from '../layout/colors';
import useProjects from '../effects/useProjects';
import useUser from '../effects/useUser';
import Page from '../components/Page';
import Text from '../components/Text';
import Header from '../components/Header';
import Space from '../components/Space';
import Size from '../components/Size';
import FlexContainer from '../components/FlexContainer';
import Panel from '../components/Panel';
import requestFromWorker from '../lib/requestFromWorker';
import { useRouter } from 'next/router';
import Spinner from '../components/Spinner';
import useTimeout from '../effects/useTimeout';
import bg from './bg.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faFileAudio, faFolderPlus } from '@fortawesome/free-solid-svg-icons'

const TallRow = styled(Row)`
  flex-grow: 1;
  margin: 0 !important;
`;

const Project = styled(FlexContainer)`
  &:hover {
    background: #222;
    cursor: pointer;
  }
`;

const UploadProject = styled(FlexContainer)`
  border: 5px dashed #929292;
  border-radius: 20px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const CloneInput = styled(Input)`
  background: transparent;
  color: #fff;
  flex-grow: 1;
`;

const Home = () => {
  const { user, loading } = useUser();
  const { projects, setProjects } = useProjects();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const startLoadingTimeout = useTimeout(() => setDelayed(true), 1000);

  const handleChooseRepository = useCallback(async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (canceled || filePaths.length !== 1) {
      return;
    }

    const projectPath = filePaths[0];
    const projects = await requestFromWorker('add-project', projectPath);
    setProjects(projects);
  }, []);

  const handleResetProjects = useCallback(async () => {
    const projects = await requestFromWorker('reset-projects');
    setProjects(projects);
  }, []);

  const deleteProject = (projectPath) => async (event) => {
    const updatedProjectsList = await requestFromWorker('delete-project', projectPath);
    setProjects(updatedProjectsList);
  }

  useEffect(() => {
    // if `user.email` is undefined, there is no user logged in
    if (!!user && typeof user.email === 'undefined' && !loading) {
      router.push('/login');
    } else if (!!user && user.email && !loading) {
      setReady(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if (ready && delayed) {
      setDelayed(false);
    } else if (!ready && !delayed) {
      startLoadingTimeout();
    }
  }, [ready, delayed]);
  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      {!ready ? (
        <SpinnerContainer>
          {delayed && <Spinner role="status" />}
        </SpinnerContainer>
      ) : (
        <>
          <Header user={user} />
          <Space padding="140px 0 0">
            <TallRow>
              <Panel md={3}>
                <Space padding="15px 15px 0">
                  <Text size="21px" weight="900">Projects</Text>
                </Space>
                {projects.length > 0 ? (
                  projects.map(({ id, name, path }) => (
                    <Space padding="15px">
                      <Project flow="row" alignItems="center" justifyContent="space-between">
                        <Link href="/project/[id]" as={`/project/${id}`} key={id}>
                          <FlexContainer flow="row">
                            <Space margin="0 10px 0 0">
                              <FontAwesomeIcon color="#fff" size="lg" icon={faFileAudio} /> 
                            </Space>
                            <Text>{name}</Text>
                          </FlexContainer>
                        </Link>
                        <FontAwesomeIcon 
                          color="#fff" 
                          size="sm" 
                          icon={faTimes} 
                          onClick={deleteProject(path)} 
                        />
                      </Project>
                    </Space>
                  ))
                ) : (
                  <Space padding="15px">
                    <Text color={complementarySecondary}>You have no active projects.</Text>
                  </Space>
                )}
              </Panel>
              <Col className="bg-info p-3" style={{ backgroundImage: `url(${bg})`}}>
                <Space margin="60px">
                  <div>
                    <Size width="450px" height="315px">
                    <UploadProject onClick={handleChooseRepository} alignItems="center" justifyContent="center">
                      <Space margin="0 0 30px">
                        <FontAwesomeIcon size="5x" color="#fff" icon={faFolderPlus}/>
                      </Space>
                      <Text size="18px">Click or drag folder to this area</Text>
                      <Text size="18px">to add it to your projects</Text>
                    </UploadProject>
                    </Size>
                    <Space padding="30px 0 0">
                      <Size width="450px">
                        <div>
                          <Space padding="0 0 10px">
                            <Text size="21px" weight="900">Clone</Text>
                          </Space>
                          <FlexContainer flow="row" justifyContent="space-between">
                            <Space margin="0 15px 0 0">
                              <CloneInput
                                type="text"
                                size="lg"
                                placeholder="Project Url"
                              />
                            </Space>
                            <Button>Clone</Button>
                          </FlexContainer>
                        </div>
                      </Size>
                    </Space>
                  </div>
                </Space>
              </Col>
            </TallRow>
          </Space>
        </>
      )}
    </Page>
  );
};

export default Home;
