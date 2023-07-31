import { type JobInsertDTO } from 'lib/types';

const jobs: JobInsertDTO[] = [
  {
    'position': 'Frontend Engineer',
    company_name: 'Google',
    'company_site': 'twitter.com',
    'location': 'Seattle',
    'description': 'Exercitation nostrud eiusmod in tempor nulla elit. Consectetur enim officia irure enim deserunt pariatur nostrud in ut fugiat adipisicing consectetur cillum. Ea anim cupidatat elit id adipisicing tempor elit nisi. Aliquip esse occaecat Lorem consequat excepteur id eu adipisicing est dolor tempor sint. Irure consequat veniam et veniam officia aute eu cillum eiusmod veniam dolor sunt cupidatat eiusmod. Deserunt incididunt aute sunt sint nisi laborum ipsum tempor est ea sit. Culpa veniam occaecat labore laboris sint nostrud ad id tempor.\r\nQui consequat ex aliquip sint veniam non amet adipisicing laboris. Sunt sunt commodo ex eiusmod incididunt et exercitation fugiat. Nostrud reprehenderit est labore Lorem voluptate dolore ex veniam cillum Lorem sunt Lorem id ut. Laboris sit occaecat excepteur ullamco sint cupidatat consequat veniam elit consequat consectetur sit. Aliquip nostrud magna minim dolor tempor et.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 3,
    priority: 1,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Frontend Engineer',
    company_name: 'Twitter',
    'company_site': 'google.com',
    'location': 'Seattle',
    'description': 'Culpa sint laboris irure ipsum tempor. Anim eu deserunt eu irure cupidatat ea minim consequat in cupidatat cupidatat. Ullamco sit do cillum ut magna magna aliqua aliqua nulla consectetur nostrud id. Mollit non quis occaecat nostrud velit deserunt tempor eiusmod minim esse qui id. Ad aute anim et sit proident.\r\nDolore laborum occaecat labore veniam ipsum non proident duis aliquip velit sit. Est amet occaecat pariatur minim aliquip duis consectetur magna reprehenderit exercitation est sit nostrud. Minim consequat in tempor nulla proident cupidatat veniam. Ullamco dolore nostrud ex mollit tempor anim. Incididunt cupidatat exercitation excepteur ad nostrud laboris dolor commodo pariatur voluptate culpa anim. Elit minim ad nulla et et officia aliqua do id sit. Nostrud dolore minim nulla nulla labore ipsum tempor est sint.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 4,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Software Engineer',
    company_name: 'Twitter',
    'company_site': 'microsoft.com',
    'location': 'Seattle',
    'description': 'Mollit exercitation commodo est esse officia Lorem dolore anim ut enim. In dolore ad eiusmod adipisicing pariatur pariatur anim tempor minim. Ad sint laborum in aliquip adipisicing culpa elit commodo non minim. Aliqua sit ut pariatur proident. Labore sunt eu minim deserunt labore officia.\r\nEst et nisi ex sunt dolor ullamco eiusmod duis non veniam. Reprehenderit Lorem ea velit qui do. Occaecat aliqua ipsum in do eu ad exercitation amet ipsum. Occaecat labore laboris voluptate non labore enim sint mollit dolore ad mollit minim velit. Quis cillum deserunt cupidatat dolore sit non. Id sit ea consectetur ipsum laboris cupidatat do ad enim. Eu in officia pariatur ipsum et id sint sunt.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 3,
    priority: 4,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Fullstack Engineer',
    company_name: 'Google',
    'company_site': 'apple.com',
    'location': 'Remote',
    'description': 'Enim ex consectetur exercitation proident proident dolor aute aute proident est sit aliquip nulla eu. Qui ut esse commodo esse veniam proident elit. Consectetur magna ipsum quis ipsum elit. Id labore officia irure anim ad ipsum pariatur amet occaecat elit. Occaecat duis enim voluptate adipisicing voluptate labore magna. Lorem sunt officia Lorem anim eu nisi Lorem aliquip excepteur. Do ad do dolor laboris reprehenderit tempor aute consectetur.\r\nUt eu sunt veniam eu. Duis cupidatat velit dolor non qui mollit cillum. Esse veniam excepteur ut commodo mollit ea in veniam dolore nisi dolor laborum irure. Ullamco sit commodo et cupidatat quis consequat ex reprehenderit voluptate culpa deserunt velit exercitation. Nostrud voluptate consectetur tempor non aute dolor labore duis culpa nostrud culpa in nulla.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 2,
    priority: 5,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Frontend Engineer',
    company_name: 'Microsoft',
    'company_site': 'twitter.com',
    'location': 'San francisco',
    'description': 'Officia ipsum amet proident mollit ut duis. Officia id Lorem nisi culpa in in laboris deserunt nulla esse. Ut adipisicing aliquip elit reprehenderit reprehenderit id. Officia elit aute amet magna duis mollit ea sit magna consequat sit labore mollit consequat.\r\nNon deserunt consequat mollit esse occaecat occaecat nulla id quis id. Exercitation ex elit voluptate velit adipisicing minim. Laborum do exercitation tempor labore pariatur ex et anim enim. Aute qui occaecat consectetur incididunt incididunt incididunt cillum cupidatat commodo dolor cupidatat labore. Adipisicing minim veniam officia consequat ex duis enim laborum laboris ad. Sit non elit consequat aliqua. Officia esse sint eu nisi consectetur veniam enim ut exercitation amet magna commodo.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3624101533',
    status: 3,
    priority: 1,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Fullstack Engineer',
    company_name: 'Google',
    'company_site': 'microsoft.com',
    'location': 'Remote',
    'description': 'Aliqua aliqua elit ut ut id. Nulla pariatur ipsum magna exercitation culpa commodo voluptate officia. Nulla adipisicing et amet voluptate magna labore quis magna dolor aute mollit eiusmod. Nostrud proident nisi occaecat laborum est sunt. Id culpa sunt ea anim aute magna ut culpa qui officia duis cillum proident minim. Lorem proident aliqua deserunt non eiusmod.\r\nAnim cupidatat sunt ad occaecat voluptate reprehenderit et. Pariatur culpa duis incididunt id ea labore id ea quis aliqua pariatur in. Lorem ex labore Lorem sit et ex. Est nisi aliquip et in et incididunt sunt irure eiusmod adipisicing proident minim irure. Do sunt deserunt labore ex ex sit do.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3624101533',
    status: 5,
    priority: 1,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Fullstack Engineer',
    company_name: 'Apple',
    'company_site': 'microsoft.com',
    'location': 'Austin',
    'description': 'Fugiat reprehenderit nostrud voluptate ex et culpa. Mollit irure cillum elit sit commodo in est occaecat tempor. Et ad aute incididunt aliqua officia ea nisi reprehenderit. Irure exercitation anim cupidatat adipisicing. Amet adipisicing consectetur sit pariatur aliqua qui ipsum reprehenderit tempor aute commodo elit id labore. Id ex cillum fugiat in dolore nulla exercitation labore ea.\r\nDolore aute proident non fugiat do aute adipisicing proident ullamco in anim nulla. Enim tempor eiusmod sit officia consectetur aliqua ut adipisicing voluptate mollit velit. Culpa nostrud aliqua est elit ea cillum esse laborum ipsum est ut ipsum qui. Esse culpa eiusmod nostrud quis velit id officia deserunt velit incididunt. Quis quis dolor id aliquip nostrud. Incididunt excepteur incididunt ea ipsum. Enim eiusmod deserunt est aliqua.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3581028408/',
    status: 1,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Fullstack Engineer',
    company_name: 'Microsoft',
    'company_site': 'google.com',
    'location': 'San francisco',
    'description': 'Veniam reprehenderit magna sit veniam magna ex commodo. Incididunt aliquip ex adipisicing do magna officia consequat culpa. Aliquip nulla officia dolor reprehenderit labore duis dolore magna quis tempor deserunt. Lorem laborum consequat dolor laboris ea. Elit exercitation do magna deserunt. Cillum eiusmod nostrud elit nostrud mollit magna eiusmod.\r\nDo id elit ad et incididunt voluptate cillum voluptate ut officia anim eu. Officia veniam sit non elit veniam. Occaecat ipsum deserunt sunt nulla. Consectetur quis proident sit velit fugiat officia. Id nulla officia adipisicing dolore quis tempor ea proident tempor ipsum adipisicing consectetur irure.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 4,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Frontend Engineer',
    company_name: 'Microsoft',
    'company_site': 'google.com',
    'location': 'San francisco',
    'description': 'Id veniam labore cillum reprehenderit irure voluptate qui magna ea pariatur dolor deserunt eiusmod nostrud. Ut cillum esse enim non. Labore ex dolore anim laborum. Occaecat occaecat Lorem nisi magna laboris enim consectetur esse. Occaecat excepteur est deserunt aliqua qui ullamco in et voluptate elit aute.\r\nEa tempor occaecat anim esse do. Nisi pariatur ut in nostrud ad veniam fugiat in esse. Ut cillum id mollit ea exercitation sit veniam minim. Proident enim do veniam id.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 2,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Software Engineer',
    company_name: 'Microsoft',
    'company_site': 'apple.com',
    'location': 'Seattle',
    'description': 'Incididunt mollit voluptate culpa ipsum labore id consequat cupidatat nulla aliqua nisi velit id aliqua. Mollit ipsum esse cupidatat incididunt. Laborum non minim ea consectetur aliqua sunt ut labore excepteur nostrud eiusmod consequat. Minim sint laborum sunt consectetur eu ipsum aliquip. Fugiat id cillum anim tempor incididunt in incididunt aute ut ad minim sint.\r\nDo tempor deserunt et deserunt aliqua fugiat minim esse labore elit. Fugiat do duis pariatur eiusmod elit excepteur nisi voluptate. Adipisicing in nisi aliqua commodo eiusmod magna proident aute occaecat. Sint deserunt in proident id laboris ipsum aute dolor ipsum proident. Qui cillum duis elit qui quis. Cupidatat officia amet sint irure ex incididunt ut do. Minim in reprehenderit commodo incididunt sit.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 5,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Fullstack Engineer',
    company_name: 'Google',
    'company_site': 'apple.com',
    'location': 'Austin',
    'description': 'Minim consectetur sint esse aliquip reprehenderit elit cupidatat culpa minim ut duis. Irure officia elit amet labore. Lorem fugiat officia amet culpa consectetur duis sit Lorem amet dolor culpa ad eu. Occaecat proident eu in do commodo veniam ullamco quis ullamco. Consectetur dolor aliqua voluptate culpa. Ipsum proident ipsum dolore cillum est pariatur. Proident fugiat est ut ex est laboris.\r\nDuis ad labore reprehenderit in amet proident tempor ex in do dolore est adipisicing. Dolor do velit consectetur veniam nisi quis veniam. Dolor exercitation Lorem aliqua ea cillum velit ullamco enim. Consectetur consequat velit irure laborum velit cupidatat ut tempor sint consectetur.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3581028408/',
    status: 4,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Fullstack Engineer',
    company_name: 'Google',
    'company_site': 'google.com',
    'location': 'San francisco',
    'description': 'Magna minim ad aliqua pariatur do exercitation excepteur tempor qui est voluptate nostrud reprehenderit quis. Commodo irure culpa adipisicing irure tempor velit consectetur incididunt laborum fugiat non. Anim ad commodo pariatur excepteur laborum laboris mollit qui nisi dolor consequat amet exercitation aliqua. Dolore quis anim dolor nulla dolor ad. Est laboris cillum dolore qui aliqua qui reprehenderit. Aute eu ipsum esse cillum qui laboris sunt do occaecat exercitation. Elit incididunt duis Lorem id commodo deserunt cupidatat elit Lorem veniam cillum ex.\r\nDuis labore dolore consectetur veniam eiusmod laboris enim consectetur excepteur laboris aute consectetur consectetur laborum. Incididunt dolore elit ex aliquip mollit excepteur. Elit culpa est aliquip ipsum tempor reprehenderit sint quis labore excepteur anim laborum. Reprehenderit excepteur Lorem officia qui enim ullamco. Proident adipisicing cillum non do quis pariatur aute aliqua tempor. Eiusmod do est irure in laborum proident ad ullamco.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 2,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Frontend Engineer',
    company_name: 'Microsoft',
    'company_site': 'twitter.com',
    'location': 'Remote',
    'description': 'Adipisicing aliqua magna consequat velit mollit enim veniam cupidatat eiusmod quis adipisicing amet Lorem. Velit qui proident pariatur mollit consequat dolore exercitation deserunt. Sint magna labore commodo in ut et nulla. Culpa non laboris enim consectetur esse aliqua et voluptate cupidatat incididunt qui commodo ex. Ipsum aliquip mollit in et dolore magna. Reprehenderit dolore ex labore aute sint labore dolore.\r\nLabore incididunt quis dolore aute proident consectetur ex consectetur incididunt officia adipisicing in ut mollit. Eiusmod velit adipisicing cupidatat aliquip occaecat nisi. Cillum ea cillum ipsum exercitation aute aliqua.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3624101533',
    status: 4,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Software Engineer',
    company_name: 'Twitter',
    'company_site': 'twitter.com',
    'location': 'Remote',
    'description': 'Voluptate minim veniam nisi nisi incididunt commodo ut et. Fugiat consequat quis dolor occaecat tempor elit pariatur occaecat. Nulla in nulla sit tempor pariatur pariatur sit ipsum non cillum non reprehenderit occaecat. Dolore deserunt minim veniam et quis in laboris ullamco sit amet. Sunt culpa aliquip sint cillum tempor irure. Ipsum ut exercitation qui voluptate.\r\nCommodo ut amet cillum eiusmod commodo enim cillum aliqua adipisicing. Ipsum quis exercitation esse eiusmod. Aute duis adipisicing sunt officia magna laborum ullamco veniam. Ipsum esse nisi mollit velit aliquip est ex cillum sit in sint tempor. Esse exercitation consequat et aliqua ut fugiat id irure id.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3581028408/',
    status: 2,
    priority: 5,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Software Engineer',
    company_name: 'Microsoft',
    'company_site': 'twitter.com',
    'location': 'Seattle',
    'description': 'Mollit cupidatat fugiat commodo ad ex pariatur commodo magna ex dolor et cupidatat magna nostrud. In ut ipsum eu duis adipisicing excepteur in consectetur esse ipsum. Aliquip irure ipsum duis consectetur irure elit magna velit qui culpa cillum. Fugiat do pariatur in sit incididunt voluptate aliqua cillum proident ea enim magna incididunt. Mollit velit deserunt ea incididunt sunt veniam enim. Mollit ipsum ea ullamco sit sint tempor. Irure amet excepteur velit aliqua irure.\r\nLabore culpa labore ex minim anim. Nulla ullamco enim proident deserunt. Ea aliquip fugiat aliqua qui est veniam veniam. Enim reprehenderit quis minim quis do consequat incididunt nulla excepteur pariatur exercitation consectetur dolore. Laborum irure elit amet laboris dolor aliquip ex consectetur enim non. Eu nisi ut in reprehenderit tempor dolore qui esse ullamco proident velit dolore quis. Aliqua enim excepteur non culpa esse exercitation consectetur cupidatat nostrud.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 5,
    priority: 3,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Frontend Engineer',
    company_name: 'Apple',
    'company_site': 'google.com',
    'location': 'Austin',
    'description': 'Veniam elit amet irure esse adipisicing tempor minim. Consectetur ex culpa adipisicing minim in. Culpa duis consectetur nostrud Lorem officia occaecat laborum. Culpa non qui magna irure. Proident aute nulla consectetur reprehenderit enim est ad exercitation nostrud. Incididunt ut do in pariatur eu adipisicing nisi cillum laboris mollit cillum. Amet veniam reprehenderit proident officia eu occaecat dolore incididunt cillum ex.\r\nExercitation esse consectetur eiusmod minim dolore sit magna anim sunt eu in sint. Quis est irure ut consequat fugiat ipsum eiusmod Lorem aute. Id labore officia anim ea sit aliqua id nostrud enim nostrud quis sit nulla. Sunt adipisicing magna adipisicing fugiat.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3581028408/',
    status: 5,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Software Engineer',
    company_name: 'Twitter',
    'company_site': 'twitter.com',
    'location': 'Remote',
    'description': 'Occaecat sunt sit deserunt proident anim pariatur aute do. Qui reprehenderit laboris id qui ipsum deserunt eiusmod ut qui elit non ex. Nisi voluptate et eiusmod mollit quis non. Irure eu commodo non duis veniam culpa ut enim nulla aliquip aliqua esse laborum cupidatat. Officia eu commodo duis anim enim mollit anim qui amet id officia commodo consectetur pariatur.\r\nEiusmod esse velit eu deserunt enim reprehenderit id esse in cupidatat commodo esse amet. Quis consequat minim ut quis. Ut commodo adipisicing cillum enim excepteur aliquip et non ex id sunt id.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 4,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Software Engineer',
    company_name: 'Microsoft',
    'company_site': 'apple.com',
    'location': 'Seattle',
    'description': 'Nulla ex aliqua cillum quis sit. Nostrud est cupidatat veniam tempor reprehenderit quis incididunt irure elit do sunt. Aliquip sunt minim quis velit ut magna cupidatat officia enim labore pariatur. Tempor qui elit veniam id dolor qui proident fugiat ea consectetur cillum veniam occaecat velit. Eiusmod in cillum commodo sit voluptate adipisicing.\r\nExcepteur cupidatat minim voluptate sint amet magna ut id culpa commodo nulla ipsum ut. Irure mollit nostrud velit excepteur ea proident occaecat anim. Magna laborum proident enim occaecat veniam. Consequat commodo culpa irure id laborum id. Veniam adipisicing ex do aliquip duis nulla ipsum ea est. Consequat enim velit reprehenderit aliqua laborum in consectetur ullamco et nulla. Minim aliqua anim pariatur magna excepteur qui in.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3624101533',
    status: 5,
    priority: 5,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Software Engineer',
    company_name: 'Apple',
    'company_site': 'microsoft.com',
    'location': 'San francisco',
    'description': 'Velit commodo et incididunt sit veniam irure nostrud elit proident officia deserunt anim. Cupidatat culpa et ullamco sunt sit consectetur commodo laboris. Irure nisi proident dolore id fugiat reprehenderit est nulla voluptate ad laboris velit. Adipisicing dolor consectetur ex aliquip anim commodo labore dolore ex est dolore deserunt dolore. Exercitation cupidatat cillum excepteur dolore veniam dolore culpa sit proident incididunt commodo aliquip nisi. Et consectetur eiusmod aliquip eiusmod incididunt cupidatat. Veniam dolore ad esse nisi eu laboris enim fugiat anim nostrud esse deserunt quis.\r\nLabore ipsum proident aliquip duis ullamco enim qui. Incididunt reprehenderit nostrud veniam ullamco sunt veniam dolor sint veniam officia nostrud id aute. Est duis sunt quis esse duis sint sint enim. Nulla proident laborum excepteur ea in anim deserunt proident eiusmod eu voluptate minim proident culpa. Duis adipisicing nostrud minim aliqua culpa aliquip nisi. Do do consectetur Lorem aliquip laborum fugiat officia aute labore commodo voluptate.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3629794436',
    status: 1,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  },
  {
    'position': 'Fullstack Engineer',
    company_name: 'Microsoft',
    'company_site': 'google.com',
    'location': 'Austin',
    'description': 'Sit pariatur exercitation officia nulla est elit anim irure sunt laborum et do. Commodo consequat tempor magna magna tempor ad est mollit ullamco anim id. Laborum aliqua dolor ipsum ullamco. Ad incididunt in aute et aliqua eiusmod do nostrud fugiat mollit do cillum duis pariatur. Aute reprehenderit laborum Lorem non duis et excepteur esse ullamco.\r\nExercitation aliquip consequat amet sint eiusmod tempor officia elit aliqua. Voluptate eu ex sunt laborum magna nostrud nostrud amet fugiat fugiat. Non adipisicing magna ullamco ad incididunt incididunt nisi aliqua. Amet fugiat non consectetur fugiat voluptate nostrud aliquip in dolore magna qui culpa. Adipisicing exercitation culpa ullamco incididunt amet adipisicing laboris ex do cillum incididunt consequat labore. Ullamco non occaecat irure quis mollit aute magna. Sunt reprehenderit in irure minim officia ex quis aliquip voluptate fugiat laborum ex.\r\n',
    'link': 'https://www.linkedin.com/jobs/view/3581028408/',
    status: 2,
    priority: 2,
    labels: ['Frontend', 'Javascript', 'NodeJs']
  }
]

export default jobs