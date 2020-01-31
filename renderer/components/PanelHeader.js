import { default as styled, css } from 'styled-components';
import { Row } from '@bootstrap-styled/v4';

const StyledRow = styled.div`
  ${props => css`
    display: flex;
    flex-flow: row;
    align-items: center;
    background-color: ${props.theme['$brand-primary']};
    color: ${props.theme['$text-color']};
    border-top: 2px solid #101010;
    width: 100%;
    height: 50px;
    padding: 25px 20px;
    line-height: 0;
    font-weight: ${props.fontWeight};
    font-size: ${props.fontSize || props.theme['$font-size-base']}
  `};
`;

export default function PanelHeader({ title, fontWeight, fontSize, renderIcon }) {
  // TODO add icon
  return (
    <StyledRow fontWeight={fontWeight || 300} fontSize={fontSize}>
      {renderIcon ? renderIcon() : null}
      {title} 
    </StyledRow>
  );
}
