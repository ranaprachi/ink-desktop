import React from 'react';
import Head from 'next/head';
import Page from '../components/Page';
import Dashboard from './dashboard';
import Project from './project';
import Tabs from '../components/Tabs';
import Text from '../components/Text';
import FlexContainer from '../components/FlexContainer';
import Space from '../components/Space';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAudio } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

const HeaderText = styled(Text)`
  white-space: nowrap;
`;

const Home = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const [tabs, setTabs] = React.useState([{
    id: null,
    head: () => (
      <HeaderText color="#fff" size="16px" weight="900" family="Bowlby One">
        INK
      </HeaderText>
    ),
    isPinned: true,
    content: () => (<Dashboard openTab={openProject} />)
  }]);

  React.useEffect(() => setSelectedTab(tabs.length - 1), [tabs]);

  const openProject = (project) => {
    setTabs((prevTabs) => {
      const currIndex = prevTabs.findIndex((tab) => tab.id && tab.id === project.id)
      if (currIndex !== -1) {
        setSelectedTab(currIndex);
        return prevTabs;
      }

      return [
        ...prevTabs,
        {
          id: project.id,
          head: () => (
            <FlexContainer flow="row" alignItems="center">
              <Space margin="0 10px 0 0">
                <FontAwesomeIcon color="#fff" size="lg" icon={faFileAudio} />
              </Space>
              <HeaderText color="#fff" size="18px" weight="100">{project.name}</HeaderText>
            </FlexContainer>
          ),
          isPinned: false,
          content: () => (<Project id={project.id} />),
        }
      ]
    });
  }

  const onTabClose = (tabIndex) => {
    let newTabs = [...tabs];
    newTabs.splice(tabIndex, 1);
    setTabs(newTabs);
    setSelectedTab(0);
  }

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      <Tabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        onTabClose={onTabClose}
        tabs={tabs}
      />
    </Page>
  );
};

export default Home;
