import styled, { css } from 'styled-components';

const FlexContainer = styled.div`
    ${
        props => css`
            display: flex;
            flex-flow: ${props.flow  || 'column'};
            flex-grow: ${props.grow  || 1};
            justify-content: ${props.justifyContent || ''};
            align-items: ${props.alignItems || ''};
        `
    }  
`;
export default FlexContainer;