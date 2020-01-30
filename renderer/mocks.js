// mock data, i.e. commits. make sure to give commits a unique hash, something
// arbitrary will be sufficient.
export const initialMockCommits = [
  {
    hash: 'fooa',
    author: {
      name: 'Shresth',
    },
    message: 'Create project',
    tags: ['genesis'],
    subBranch: [
      {
        hash: 'foo1b',
        author: {
          name: 'Emma',
        },
        message: 'Add bass line',
      },
      {
        hash: 'foo2c',
        author: {
          name: 'Emma',
        },
        message: 'Adjust compressor settings',
      },
      {
        hash: 'foo3d',
        author: {
          name: 'Yash',
        },
        message: 'Adjust compressor settings testing',
      },
    ],
  },
  {
    hash: 'bare',
    author: {
      name: 'Shresth',
    },
    message: 'Add guitar',
    tags: ['vocals', 'fx'],
  },
  {
    hash: 'bar2f',
    author: {
      name: 'Shresth',
    },
    message: 'Add delay',
    tags: ['vocals', 'fx'],
    subBranch: [
      {
        hash: 'foo1g',
        author: {
          name: 'Emma',
        },
        message: 'Add bass line',
        subBranch: [
          {
            hash: 'foo1h',
            author: {
              name: 'Emma',
            },
            message: 'Add bass line',
            subBranch: [
              {
                hash: 'foo1i',
                author: {
                  name: 'Emma',
                },
                message: 'Add bass line',
              },
              {
                hash: 'foo2j',
                author: {
                  name: 'Emma',
                },
                message: 'Adjust compressor settings',
              },
            ],
          },
          {
            hash: 'foo2k',
            author: {
              name: 'Emma',
            },
            message: 'Adjust compressor settings',
          },
          {
            hash: 'foo3l',
            author: {
              name: 'Yash',
            },
            message: 'Adjust compressor settings testing',
          },
        ],
      },
      {
        hash: 'foo2m',
        author: {
          name: 'Emma',
        },
        message: 'Adjust compressor settings',
      },
      {
        hash: 'foo3n',
        author: {
          name: 'Yash',
        },
        message: 'Adjust compressor settings testing',
      },
    ],
  },
];

export const timedCommit = {
  hash: 'stefanscommit1337',
  author: {
    name: 'Stefan',
  },
  message: "Adjust EQ on Shresth's rec",
};

export const trackEmoji = ['🎸', '🥁', '🎺', '🎶', '🎷'];
