import { remote } from 'electron';
import { ipcRenderer as ipc } from 'electron-better-ipc';
import React, { useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { default as styled } from 'styled-components';
import {
  Row,
  Col,
  H5,
  Button,
  Container,
} from '@bootstrap-styled/v4';
import { complementarySecondary } from '../layout/colors';
import useProjects from '../effects/useProjects';
import useUser from '../effects/useUser';
import Page from '../components/Page';
import Header from '../components/Header';
import Panel from '../components/Panel';
import fetch from 'isomorphic-unfetch';

const FlexContainer = styled(Container)`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  min-height: 100%;
  padding: 0;
`;

const TallRow = styled(Row)`
  flex-grow: 1;
  margin: 0 !important;
`;

const Message = styled.p`
  color: ${complementarySecondary};
`;

const ProjectName = styled.p`
  color: #fff;
`;

const Home = () => {
  const { user } = useUser();
  const { projects, setProjects } = useProjects();

  const handleChooseRepository = useCallback(async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (canceled || filePaths.length !== 1) {
      return;
    }

    const projectPath = filePaths[0];
    const projects = await ipc.callMain('add-project', projectPath);
    setProjects(projects);
  }, []);

  const handleResetProjects = useCallback(async () => {
    const projects = await ipc.callMain('reset-projects');
    setProjects(projects);
  }, []);

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      <Header user={user} />
      <FlexContainer fluid={true}>
        <React.Fragment>
          <TallRow>
            <Panel md={2} />
            <Col className="bg-info p-3">
              <Row>
                <Col md={12}>
                  <H5>Projects</H5>
                </Col>
              </Row>

              {projects.length > 0 ? (
                projects.map(({ id, name, path }) => (
                  <Row key={`project-${id}`}>
                    <Col md={12}>
                      <Link href="/project/[id]" as={`/project/${id}`}>
                        <a href={`/project/${id}`}>
                          <ProjectName>{name}</ProjectName>
                        </a>
                      </Link>
                    </Col>
                  </Row>
                ))
              ) : (
                <Row>
                  <Col md={12}>
                    <Message>You have no active projects.</Message>
                  </Col>
                </Row>
              )}

              <Row>
                <Col md={12}>
                  <Button className="mr-2" onClick={handleChooseRepository}>
                    Add
                  </Button>
                  <Button className="mr-2" color="secondary">
                    Clone
                  </Button>
                  <Button className="mr-2" color="info">
                    Search
                  </Button>
                  {/*<Button className="mr-2" onClick={handleResetProjects}>
                  Reset Projects
                </Button>*/}
                </Col>
              </Row>
            </Col>

            <Panel md={3}></Panel>
          </TallRow>
        </React.Fragment>
      </FlexContainer>
    </Page>
  );
};

export default Home;
