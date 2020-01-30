import React from 'react';
import times from "lodash.times";
import styled from 'styled-components';
import { Tooltip } from '@bootstrap-styled/v4';
import {
  buttonInfo,
  buttonPrimary,
  buttonSecondary
} from '../layout/colors';
import Text from './Text';
import Space from './Space';
import FlexContainer from './FlexContainer';
import UserImage from './UserImage';
import gravatar from 'gravatar';

// Commit graph config
const GRAPH_LINE_LENGTH = "100px";
const GRAPH_LINE_WIDTH = "4px";
const GRAPH_SUB_BRANCH_DEPTH = "60px";
const GRAPH_COLORS = [buttonPrimary, buttonSecondary, buttonInfo];

const NodeElement = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color || '#fff'}
`;

const GraphLine = styled.div`
  width: ${GRAPH_LINE_LENGTH};
  height: 0px;
  border-bottom: ${GRAPH_LINE_WIDTH} solid ${props => props.color || '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transform: translateY(${GRAPH_SUB_BRANCH_DEPTH});
`;

const SubBranchContainer = styled.div`
  position: relative;
  transform: translateY(${GRAPH_SUB_BRANCH_DEPTH});
`;

const BranchConnector = styled.div`
  position: absolute;
  top: 0;
  left: ${props => props.type === "left" ? 0 : ""};
  right: ${props => props.type === "right" ? 0 : ""};
  height: ${GRAPH_SUB_BRANCH_DEPTH};
  border-left: ${GRAPH_LINE_WIDTH} solid ${props => props.color || '#fff'};
`;

const Node = ({ node, color }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <NodeElement color={color} id={node.hash} />
      <Tooltip
        placement="top"
        isOpen={isOpen}
        toggle={() => setIsOpen(prevIsOpen => !prevIsOpen)}
        target={node.hash}
      >
        <Space padding="5px">
          <FlexContainer flow="row" alignItems="center">
            <UserImage src={gravatar.url(node.author.email || "")} alt="Author" size="25px" borderColor={color} />
            <div>
              <Text size="12px">{node.message}</Text>
              <Text size="10px" color="#8B8B8B" align="right">-{node.author.name}</Text>
            </div>
          </FlexContainer>
        </Space>
      </Tooltip>
    </>
  )
}

const CommitGraph = ({ graph }) => {
  const getTotalCommits = (node) => {
    const calculateTotalCommits = (element, initialVal) =>
      element.subBranch.reduce((accCommits, subElement) => {
        if (subElement.subBranch && subElement.subBranch.length) {
          accCommits = calculateTotalCommits(subElement, accCommits);
        }
        return ++accCommits;
      }, initialVal);

    return node.subBranch && node.subBranch.length ? calculateTotalCommits(node, 0) : 0;
  }

  const makeSubBranch = (subGraph, level) => (
    <SubBranchContainer>
      <BranchConnector type="left" color={GRAPH_COLORS[level]} />
      <FlexContainer flow="row" color={GRAPH_COLORS[level]}>
        {subGraph.map((subGraphNode, index) => makeGraph(subGraphNode, level))}
      </FlexContainer>
      <BranchConnector type="right" color={GRAPH_COLORS[level]} />
    </SubBranchContainer>
  );

  const makeGraph = (node, level) => {
    const totalSubCommits = getTotalCommits(node);
    return <React.Fragment key={node.hash}>
      <GraphLine color={GRAPH_COLORS[level]}>
        <Node color={GRAPH_COLORS[level]} node={node} />
      </GraphLine>
      {
        totalSubCommits ? (
          <div>
            <FlexContainer flow="row">
              {times(totalSubCommits, (i) => <GraphLine color={GRAPH_COLORS[level]} key={`graph-line-${i}`} />)}
            </FlexContainer>
            {makeSubBranch(node.subBranch, level + 1)}
          </div>
        ) : null
      }
    </React.Fragment>
  }

  return (
    <Space padding="50px">
      <FlexContainer flow="row">
        {graph.filter(grp => !!grp).map((graphNode) => makeGraph(graphNode, 0))}
      </FlexContainer>
    </Space>
  );
}

export default CommitGraph;