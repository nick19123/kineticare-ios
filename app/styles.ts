import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#e0e0e0',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    //alignItems: 'center',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: -6,
    marginLeft: -(width * 0.05),
    zIndex: 1,
   },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  toggleButtonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  exerciseContainer: {
    marginBottom: 20,
  },
  exerciseItem: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
    borderRadius: 10,
  },
  exerciseImage: {
    width: width * 0.4,
    height: height * 0.2,
    resizeMode: 'contain',
  },
  exerciseTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', 
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666', 
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
  },
  nestedModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nestedModalImage: {
    width: 256,
    height: 256,
    resizeMode: 'contain',
    margin: 10,
    borderRadius: 20, // Adjust this value to make the corners rounded
  },
  nestedModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  nestedModalDetails: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: width * 0.075,
  },
  nestedModalDetail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Roboto_700Bold', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  nestedModalDetailText: {
    fontFamily: 'Roboto_400Regular', 
    textAlign: 'left', // Center the text
    fontStyle: 'italic', // Italic text for quotation
  },
  nestedModalDetailReps: {
    fontFamily: 'Roboto_700Bold', 
    textAlign: 'right', // Align the reps text to the right
  },
  nestedModalDetailBox: {
    backgroundColor: '#f0f0f0', // Light gray background
    borderRadius: 10, // Rounded corners
    padding: width*0.025, // Padding inside the box
    marginVertical: 5, // Vertical margin
    alignItems: 'center', // Center the text
    justifyContent: 'center', // Center the text
  },
  grayBlob: {
    position: 'absolute',
    top: -0.5,
    left: -0.5,
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
  },
  grayBlobText: {
    color: 'white',
    fontSize: 10,
  },
  barButton: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  barButtonText: {
    color: '#7874ac',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 0.1,
    paddingHorizontal: 0.1,
    borderRadius: 1,
  },
  cameraView: {
    position: 'absolute',
    top: '10%',
    width: '95%',
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningBox: {
    width: '70%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'rgba(120, 116, 172, 1)',
    borderRadius: 20,
    backgroundColor:'transparent',
    zIndex: 1,
  },
  scanningBoxImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
    opacity: 0.5,
  },
});
