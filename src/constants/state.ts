interface IEvidenceState {
  [key: string]: {
    text: string;
    color: string;
  };
}

export const EvidenceState: IEvidenceState = {
  'public': {
    text: 'EVIDENCE_DETAIL_PAGE.STATE_PUBLIC',
    color: '#3DD08C',
  },
  'private': {
    text: 'EVIDENCE_DETAIL_PAGE.STATE_PRIVATE',
    color: '#FC8181',
  },
};

export const DefaultEvidenceState = {
  text: 'EVIDENCE_DETAIL_PAGE.STATE_PRIVATE',
  color: '#FC8181',
};
