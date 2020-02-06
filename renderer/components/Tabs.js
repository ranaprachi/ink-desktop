import React from "react";
import FlexContainer from "./FlexContainer";
import Size from "./Size";
import Space from "./Space";
import Text from "./Text";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileAudio, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import styled from "styled-components";

const TabHeaderContainer = styled(FlexContainer)`
    flex: 0;
    position: relative;
`;

const TabBodyContainer = styled.div`
    overflow: auto;
    height: 100%;
`;

const TabsHeadDivider = styled.div`
    position: absolute;
    width: 2px;
    height: 80%;
    right: -1px;
    z-index: 1;
    border-radius: 2px;
    background: #929292;
`;

const Tabs = ({ selectedTab, setSelectedTab, onTabClose, tabs, }) => {
    const onTabChange = (index) => () => {
        if (index !== selectedTab) {
            setSelectedTab(index);
        }
    }

    return (
        <Size height="100vh">
            <FlexContainer>
                <Size maxHeight="60px">
                    <FlexContainer flow="row" alignItems="stretch" style={{ background: '#222222' }}>
                        {tabs.map((tab, index) => (
                            <Space
                                padding="15px 20px"
                                key={`tab-${index}`}
                                style={{ background: index === selectedTab ? "#181818" : "" }}
                            >
                                <TabHeaderContainer flow="row" alignItems="center" onClick={onTabChange(index)}>
                                    {tab.head()}
                                    {
                                        tab.isPinned
                                            ? null
                                            : (
                                                <Space margin="0 0 0 15px">
                                                    <FontAwesomeIcon
                                                        color="#fff"
                                                        size="lg"
                                                        icon={faTimes}
                                                        onClick={(event) => {
                                                            event.stopPropagation(); 
                                                            onTabClose(index);
                                                        }}
                                                    />
                                                </Space>
                                            )
                                    }
                                    {index === 0 ? <TabsHeadDivider/> : null}
                                </TabHeaderContainer>
                            </Space>
                        ))}
                    </FlexContainer>
                </Size>
                <TabBodyContainer>
                    {tabs[selectedTab] ? tabs[selectedTab].content() : null}
                </TabBodyContainer>
            </FlexContainer>
        </Size >
    );
}

export default Tabs;