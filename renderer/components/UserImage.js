import styled from 'styled-components';

const UserImage = styled.img`
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  margin-right: 10px;
  border-radius: 50%;
  background-color: #ddd;
  border: ${props => props.borderColor ? `2px solid ${props.borderColor}` : ''};
`;

export default UserImage;