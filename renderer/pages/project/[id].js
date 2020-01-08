import React, { useCallback } from 'react';
import styled from 'styled-components';
import slugify from 'slugify';
import {inviteCollaborators} from '../../lib/mail';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Col,
  H5,
  Row,
  Button,
  Form,
  FormGroup,
  Container,
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
import useTemporaryState from '../../effects/useTemporaryState';
import { animated } from 'react-spring';
import useFade from '../../effects/useFade';
import { initialMockCommits, trackEmoji } from '../../mocks';
import ActivityIcon from '../../components/ActivityIcon';
import requestFromWorker from '../../lib/requestFromWorker';

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

  const handleInvite = useCallback(async event => {
    event.preventDefault();

    const recipients = invitationRecipient
      .split(/[ ,]+/)
      .map(recipient => recipient.trim());
    await inviteCollaborators(
      recipients,
      invitationMessage,
      project.name,
      slugify(project.name)
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
      <FlexContainer fluid={true}>
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
              {delta.tracks && (
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
                  disabled={!(delta.tracks && delta.tracks.length > 0)}
                  className="mr-2"
                  type="submit"
                >
                  Sign
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
              style={{ boxShadow: 'inset 0 0 7px rgba(0, 0, 0, .8)' }}
            >
              <Row className="mt-3">
                <Col md={12}>
                  <GraphTitle>
                    <HistoryIcon width={25} marginRight={10} />{' '}
                    <span>History</span>
                  </GraphTitle>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CommitGraph graph={initialMockCommits.concat(graph)} />
                </Col>
              </Row>
            </Col>
            <Panel md={3}>
              <PanelHeader title="Share" fontWeight="500" />
              <Form className="m-2" onSubmit={handleInvite}>
                <ShareImage style={{ margin: '10px 0' }} />
                <FormGroup>
                  <Input
                    required
                    type="email"
                    placeholder="Recipient"
                    {...bindInvitationRecipient}
                  />
                  <Textarea
                    required
                    placeholder="Message"
                    className="mt-2"
                    {...bindInvitationMessage}
                  />
                </FormGroup>
                <Button className="mr-2" type="submit">
                  Send
                </Button>
                {mailSentTransitions.map(
                  ({ item, key, props }) =>
                    item && (
                      <SendSuccess key={key} style={props}>
                        Sent!
                      </SendSuccess>
                    )
                )}
              </Form>
            </Panel>
          </TallRow>
        )}
      </FlexContainer>
    </Page>
  );
}
