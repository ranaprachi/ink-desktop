import React from "react";
import styled, { css } from "styled-components";

const Position = styled(({children, ...props}) => React.cloneElement(children, props))`
    ${
        props => css`
            position: ${props.position || ''};
            top: ${props.top || ''};
            bottom: ${props.bottom || ''};
            left: ${props.left || ''};
            right: ${props.right || ''};
            z-index: ${props.zIndex || ''};
        `
    }
`;

export default Position;