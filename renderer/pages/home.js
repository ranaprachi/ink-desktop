import React from 'react';
import Head from 'next/head';
import Page from '../components/Page';
import Dashboard from './dashboard';
import Project from './project';
import Tabs from '../components/Tabs';
import Text from '../components/Text';
import Size from '../components/Size';
import FlexContainer from '../components/FlexContainer';
import Space from '../components/Space';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAudio } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';
import Logo from '../components/Logo';

const HeaderText = styled(Text)`
  white-space: nowrap;
`;

const Home = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const [tabs, setTabs] = React.useState([{
    id: null,
    head: () => (
      <Size height="60px">
        <FlexContainer alignItems="center" justifyContent="center"><Logo width="40" /></FlexContainer>
      </Size>
    ),
    isPinned: true,
    content: () => (<Dashboard openTab={openProject} />)
  }]);

  const openProject = (project) => {
    setTabs((prevTabs) => {
      const projectIndex = prevTabs.findIndex((tab) => tab.id && tab.id === project.id)
      if (projectIndex !== -1) {
        setSelectedTab(projectIndex);
        return prevTabs;
      }

      let newTabs = [
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
      ];
      setSelectedTab(newTabs.length-1);
      return newTabs;
    });
  }

  const onTabClose = (tabIndex) => {
    let newTabs = [...tabs];
    newTabs.splice(tabIndex, 1);
    if(selectedTab === tabIndex) {
      setSelectedTab(0);
    } else {
      setSelectedTab(newTabs.findIndex((tab) => tab.id === tabs[selectedTab].id))
    }
    setTabs(newTabs);
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
