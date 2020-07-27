// Modules to control application life and create native browser window
const {app, ipcMain, clipboard, BrowserWindow} = require('electron')
const faker = require('faker')
const path = require('path')
const Store = require('./store.js');
const { menubar } = require('menubar');

const mb = menubar({
  browserWindow: {
    width: 370,
    height: 300,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  },
  icon: 'icon.png',
  preloadWindow: true,
})

mb.on('after-create-window', () => {
  mb.window.openDevTools()
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    lang: 'en'
  }
});

mb.on('ready', () => {
  console.log('Menubar app is ready.');
  faker.locale = store.get('lang');
  console.log(faker.locale);
});


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

ipcMain.on('copy', (event, arg) => {
  let text = '';
  switch (arg) {
    case 'firstName':
      text = faker.name.firstName();
      break;

    case 'lastName':
      text = faker.name.lastName();
      break;

    case 'findName':
      text = faker.name.findName();
      break;

    case 'companyName':
      text = faker.company.companyName();
      break;

    case 'phoneNumber':
      text = faker.phone.phoneNumber();
      break;

    case 'jobTitle':
      text = faker.name.jobTitle();
      break;

    case 'userName':
      text = faker.internet.userName();
      break;

    case 'email':
      text = faker.internet.email();
      break;

    case 'streetName':
      text = faker.address.streetName();
      break;

    case 'streetAddress':
      text = faker.address.streetAddress();
      break;

    case 'zipCode':
      text = faker.address.zipCode();
      break;

    case 'city':
      text = faker.address.city();
      break;

    case 'country':
      text = faker.address.country();
      break;

    default:
      text = '';
      break;
  }

  clipboard.writeText(text)
  event.reply('copy-response', 'Copied!')
  mb.hideWindow()
})

ipcMain.on('lorem', (event, arg) => {
  let text
  switch (arg.label) {
    case 'word':
      text = faker.lorem.words(arg.index);
      break;

    case 'sentence':
      text = faker.lorem.sentences(arg.index);
      break;

    case 'paragraph':
      text = faker.lorem.paragraphs(arg.index);
      break;

    default:
      break;
  }

  clipboard.writeText(text)
  event.reply('copy-response', 'Copied!')
  mb.hideWindow()
})