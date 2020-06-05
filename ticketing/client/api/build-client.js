import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // from Server
    return axios.create({
      baseURL: 'http://nginx-ingress-controller.kube-system.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // from Browser
    return axios.create({
      baseURL: '/',
    });
  }
};
