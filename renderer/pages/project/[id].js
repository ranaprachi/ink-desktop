import React, { useCallback } from 'react';
import styled from 'styled-components';
import slugify from 'slugify';
import { inviteCollaborators } from '../../lib/mail';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Col,
  H5,
  Row,
  Button,
  Form,
  FormGroup,
} from '@bootstrap-styled/v4';
import Header from '../../components/Header';
import Page from '../../components/Page';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Panel from '../../components/Panel';
import PanelHeader from '../../components/PanelHeader';
import ShareImage from '../../components/ShareImage';
import useProjects from '../../effects/useProjects';
import useProjectState from '../../effects/useProjectState';
import useInput from '../../effects/useInput';
import useUser from '../../effects/useUser';
import CommitGraph from '../../components/CommitGraph';
import {
  buttonPrimary,
  complementaryPrimary,
  highlightSecondary,
  playerBackground,
} from '../../layout/colors';
import HistoryIcon from '../../components/HistoryIcon';
import FlexContainer from '../../components/FlexContainer';
import useTemporaryState from '../../effects/useTemporaryState';
import { animated } from 'react-spring';
import useFade from '../../effects/useFade';
import { initialMockCommits, trackEmoji } from '../../mocks';
import ActivityIcon from '../../components/ActivityIcon';
import requestFromWorker from '../../lib/requestFromWorker';
import Space from '../../components/Space';
import Text from '../../components/Text';
import Size from '../../components/Size';
import bg from './../bg.jpeg';

const TallRow = styled(Row)`
  flex-grow: 1;
  margin: 0 !important;
`;

const TrackIcon = styled.em`
  margin-right: 8px;
  font-size: 24px;
  font-style: normal;
`;

const TrackName = styled.span`
  font-size: 20px;
  line-height: 100%;
  color: ${buttonPrimary};
`;

const MoreInfo = styled.em`
  font-style: normal;
  font-size: 16px;
  line-height: 100%;
  color: ${highlightSecondary};
`;

const TrackLine = styled(Col).attrs({
  md: 12,
})`
  margin-top: ${props => (props.offsetTop || 0) + 10}px;
`;

const MoreTracksLine = styled(TrackLine)`
  margin-top: 14px;
`;

const NoNewTracksLine = styled(TrackLine)`
  margin-top: 12px;
`;

const GraphTitle = styled(H5)`
  display: flex;
  flex-flow: row;
  align-items: center;
`;

const SendSuccess = styled(animated.em)`
  display: inline-block;
  margin: 3px;

  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: ${complementaryPrimary};
`;

const IconLink = styled.div`
  transition: opacity ease-in-out 0.15s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const SendButton = styled(Button)`
  float: right;
  margin-bottom: 20px;
`;

const MediaPlayerContainer = styled.div`
  background: #0B0B0B;
`;

export default function Repo() {
  const { query } = useRouter();
  const { projects } = useProjects();
  const { user } = useUser();
  const [commitSigned, setCommitSigned] = useTemporaryState(false, 5000);
  const [mailSent, setMailSent] = useTemporaryState(false, 5000, () => {
    resetInvitationRecipient();
    resetInvitationMessage();
  });
  const mailSentTransitions = useFade(mailSent);
  const commitSignedTransitions = useFade(commitSigned);
  const project = projects.find(project => project.id === query.id);

  // state is of the following structure:
  // state = { new: Array(), modified: Array(), deleted: Array() }
  const { status, graph, delta, reloadProjectState } = useProjectState(
    project ? project.path : null
  );

  const {
    value: commitMessage,
    bind: bindCommitMessage,
    reset: resetCommitMessage,
  } = useInput('');

  const {
    value: invitationRecipient,
    bind: bindInvitationRecipient,
    reset: resetInvitationRecipient,
  } = useInput('');

  const {
    value: invitationMessage,
    bind: bindInvitationMessage,
    reset: resetInvitationMessage,
  } = useInput('');

  const handleSignCommit = useCallback(
    async event => {
      event.preventDefault();

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }
      const projectPath = project.path;
      await requestFromWorker('commit-project', { projectPath, commitMessage });

      resetCommitMessage();
      setCommitSigned(true);
      await reloadProjectState();
    },
    [project, commitMessage]
  );

  const handlePush = useCallback(
    async event => {
      event.preventDefault();
      const projectPath = project.path;
      await requestFromWorker('push-project', { projectPath });
    },
    [project]
  );

  const handlePull = useCallback(
    async event => {
      event.preventDefault();
      const projectPath = project.path;
      await requestFromWorker('pull-project', { projectPath });
      await reloadProjectState();
    },
    [project]
  );

  const handleInvite = useCallback(async event => {
    event.preventDefault();

    const recipients = invitationRecipient
      .split(/[ ,]+/)
      .map(recipient => recipient.trim());
    await inviteCollaborators(
      recipients,
      invitationMessage,
      project.name,
      slugify(project.name),
      user
    );
    setMailSent(true);
  });

  const handleRefreshProject = useCallback(async event => {
    event.preventDefault();
    await reloadProjectState();
  });

  return (
    <Page>
      <Head>
        <title>ununu • Ink</title>
      </Head>
      <Header user={user} project={project} />
      <Space padding="140px 0 0">
        <FlexContainer>
        {project && (
          <TallRow>
            <Panel md={3}>
              <PanelHeader
                title="Changed Tracks"
                fontWeight="bold"
                renderIcon={() => (
                  <IconLink onClick={handleRefreshProject}>
                    <ActivityIcon />
                  </IconLink>
                )}
              />
              {delta && delta.tracks && (
                <>
                  {delta.tracks.slice(1, 5).map((trackName, index) => (
                    <TrackLine key={`new-${index}`}>
                      <TrackIcon>{trackEmoji[index]}</TrackIcon>
                      <TrackName>{trackName}</TrackName>
                    </TrackLine>
                  ))}
                  {delta.tracks.length > 5 && (
                    <MoreTracksLine>
                      <MoreInfo>
                        + {delta.tracks.length - 5} more tracks
                      </MoreInfo>
                    </MoreTracksLine>
                  )}
                  {delta.tracks.length === 0 && (
                    <NoNewTracksLine>
                      <MoreInfo>No new tracks.</MoreInfo>
                    </NoNewTracksLine>
                  )}
                </>
              )}

              {/*status.new && status.new.length > 0 && (
                <React.Fragment>
                  <Row>
                    <H6>New Files</H6>
                  </Row>

                  {status.new.map((filePath, index) => (
                    <Row key={`new-${index}`}>
                      <Col md={12}>
                        <code>{filePath}</code>
                      </Col>
                    </Row>
                  ))}
                </React.Fragment>
              )*/}
              {/*status.modified && status.modified.length > 0 && (
                <React.Fragment>
                  <Row>
                    <H6>Modified Files</H6>
                  </Row>

                  {status.modified.map((filePath, index) => (
                    <Row key={`new-${index}`}>
                      <Col md={12}>
                        <code>{filePath}</code>
                        </Col>
                    </Row>
                  ))}
                </React.Fragment>
              )*/}

              <Form onSubmit={handleSignCommit} className="m-2 mt-4">
                <FormGroup>
                  <Input
                    required
                    type="text"
                    placeholder="Enter message"
                    {...bindCommitMessage}
                  />
                </FormGroup>
                <Button
                  disabled={!(delta && delta.tracks && delta.tracks.length > 0)}
                  className="mr-2"
                  type="submit"
                >
                  Sign
                </Button>
                <Button className="mr-2" onClick={handlePush}>
                  Push
                </Button>
                <Button className="mr-2" onClick={handlePull}>
                  Pull
                </Button>
                {commitSignedTransitions.map(
                  ({ item, key, props }) =>
                    item && (
                      <SendSuccess key={key} style={props}>
                        Signed!
                      </SendSuccess>
                    )
                )}
              </Form>
            </Panel>
            <Col
              className="bg-info"
              style={{ boxShadow: 'inset 0 0 7px rgba(0, 0, 0, .8)', backgroundImage: `url(${bg})`}}
            >
              <Row>
                <Size width="100%" height="230px">
                  <MediaPlayerContainer />
                </Size>
              </Row>
              <Row className="mt-3">
                <Col md={12}>
                  <GraphTitle>
                    <HistoryIcon width={25} marginRight={10} />{' '}
                    <span>History</span>
                  </GraphTitle>
                </Col>
                <Col md={12}>
                  <CommitGraph graph={initialMockCommits.concat(graph)} />
                </Col>
              </Row>
            </Col>
            <Panel md={3}>
              <PanelHeader title={project.name.toUpperCase()} fontWeight="100" fontSize="21px" />
              <Form className="m-2" onSubmit={handleInvite}>
                <Space padding="40px">
                  <div>
                    <ShareImage />
                  </div>
                </Space>
                <Space padding="0 20px">
                  <div>
                    <Text size="22px" weight="500" align="center">Share it!</Text>
                    <Space padding="4px 0 24px">
                      <Text size="18px" weight="300" align="center" height="21px">
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </Text>
                    </Space>
                    <FormGroup>
                      <Input
                        required
                        type="email"
                        placeholder="Recipient"
                        {...bindInvitationRecipient}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Textarea
                        required
                        placeholder="Message"
                        className="mt-2"
                        {...bindInvitationMessage}
                      />
                    </FormGroup>
                    <SendButton type="submit">Send</SendButton>
                    {mailSentTransitions.map(
                      ({ item, key, props }) =>
                        item && (
                          <SendSuccess key={key} style={props}>
                            Sent!
                          </SendSuccess>
                        )
                    )}
                  </div>
                </Space>
              </Form>
            </Panel>
          </TallRow>
        )}
      </FlexContainer>
      </Space>
    </Page>
  );
}
