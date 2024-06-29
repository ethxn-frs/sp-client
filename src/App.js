import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import AdminHomeComponent from './components/Admin/AdminHome/AdminHomeComponent';
import AdminListFormationCenterComponent from './components/Admin/AdminFormationCenter/AdminListFormationCenterComponent';
import AdminCreateFormationCenterComponent from './components/Admin/AdminFormationCenter/AdminCreateFormationCenterComponent';
import AdminCreatePlanningComponent from './components/Admin/AdminPlanning/AdminCreatePlanningComponent';
import AdminCreatePlayerComponent from './components/Admin/AdminPlayer/AdminCreatePlayerComponent';
import AdminListPlayerComponent from './components/Admin/AdminPlayer/AdminListPlayerComponent';
import AdminCreatePoolComponent from './components/Admin/AdminPool/AdminCreatePoolComponent';
import AdminListPoolComponent from './components/Admin/AdminPool/AdminListPoolComponent';
import AdminListUserComponent from './components/Admin/AdminUser/AdminListUserComponent';
import AdminAnalyseComponent from './components/Admin/AdminHome/AdminAnalyseComponent';
import AdminEditSondageComponent from './components/Admin/AdminPool/AdminEditSondageComponent';
import { UserProvider } from './contexts/UserContext';
import AdminHeaderComponent from './components/Admin/AdminHeader/AdminHeaderComponent';
import AdminDetailPoolComponent from './components/Admin/AdminPool/AdminDetailPoolComponent';
import AdminListSportComponent from './components/Admin/AdminSport/AdminListSportComponent';
import AdminCreateSportComponent from './components/Admin/AdminSport/AdminCreateSportComponent';
import AdminEditSportComponent from './components/Admin/AdminSport/AdminEditSportComponent';
import AdminDetailSportComponent from './components/Admin/AdminSport/AdminDetailSportComponent';
import AdminEditFormationCenterComponent from './components/Admin/AdminFormationCenter/AdminEditFormationCenterComponent';
import AdminDetailFormationCenterComponent from './components/Admin/AdminFormationCenter/AdminDetailFormationCenterComponent';
import AdminDetailPlayerComponent from './components/Admin/AdminPlayer/AdminDetailPlayerComponent';
import AdminEditPlayerComponent from './components/Admin/AdminPlayer/AdminEditPlayerComponent';
import AdminListClubComponent from './components/Admin/AdminClub/AdminListClubComponent';
import AdminCreateClubComponent from './components/Admin/AdminClub/AdminCreateClubComponent';
import AdminDetailClubComponent from './components/Admin/AdminClub/AdminClubDetailComponent';
import AdminCreateUserComponent from './components/Admin/AdminUser/AdminCreateUserComponent';
import AdminDetailUserComponent from './components/Admin/AdminUser/AdminDetailUserComponent';
import LoginComponent from './components/Login/LoginComponent';
import AdminListDocumentComponent from './components/Admin/AdminDocument/AdminListDocumentComponent';
import AdminCreateDocument from './components/Admin/AdminDocument/AdminCreateDocumentComponent';
import HomeComponent from './components/Home/HomeComponent';
import ContactComponent from './components/Contact/ContactComponent';
import AboutUsComponent from './components/AboutUs/AboutUsComponent';
import BlogComponent from './components/Blog/BlogComponent';
import DonationComponent from './components/Donate/DonationComponent';
import LogoutComponent from './components/Logout/LogoutComponent';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import AdminEditClubComponent from './components/Admin/AdminClub/AdminEditClubComponent';
import FirstConnectionComponent from './components/FirstConnetion/FirstConnectionComponent';
import A2FVerificationComponent from './components/A2FVerification/A2FVerificationComponent';
import AdminCreateNewsletterComponent from './components/Admin/AdminNewsletter/AdminCreateNewsletterComponent';
import ClubHomeComponent from './components/Club/ClubHomeComponent';
import AdminInvitationComponent from './components/Admin/AdminInvitation/AdminInvitationComponent';
import AdminListEventProposalComponent from './components/Admin/AdminEventProposal/AdminListEventProposalComponent';
import AdminListTransactionsComponent from './components/Admin/AdminTransaction/AdminListTransactionsComponent';
import AdminToolsComponent from './components/Admin/AdminTools/AdminToolsComponent';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/login/a2f" element={<A2FVerificationComponent />} />
            <Route path="/contact" element={<ContactComponent />} />
            <Route path="/aboutus" element={<AboutUsComponent />} />
            <Route path="/blog" element={<BlogComponent />} />
            <Route path="/don" element={<DonationComponent />} />
            <Route path="/login/first-connection" element={<FirstConnectionComponent />} />

            <Route path="/club" element={<ClubHomeComponent />} />

            <Route element={<Layout />}>
              <Route path="admin" element={<AdminHomeComponent />} />
              <Route path="admin/logout" element={<LogoutComponent />} />
              <Route path="admin/analyse" element={<AdminAnalyseComponent />} />
              <Route path="admin/tools" element={<AdminToolsComponent />} />

              <Route path="admin/formations-centers" element={<AdminListFormationCenterComponent />} />
              <Route path="admin/formations-centers/:id/edit" element={<AdminEditFormationCenterComponent />} />
              <Route path="admin/formations-centers/create" element={<AdminCreateFormationCenterComponent />} />
              <Route path="admin/formations-centers/:id" element={<AdminDetailFormationCenterComponent />} />

              <Route path="admin/events/planning" element={<AdminCreatePlanningComponent />} />
              <Route path="/admin/events/proposals" element={<AdminListEventProposalComponent />} />
              <Route path="admin/events/invitations" element={<AdminInvitationComponent />} />

              <Route path="admin/players" element={<AdminListPlayerComponent />} />
              <Route path="admin/players/create" element={<AdminCreatePlayerComponent />} />

              <Route path="admin/pools" element={<AdminListPoolComponent />} />
              <Route path="admin/pools/create" element={<AdminCreatePoolComponent />} />
              <Route path="admin/pools/:id/edit" element={<AdminEditSondageComponent />} />
              <Route path="admin/pools/:id" element={<AdminDetailPoolComponent />} />

              <Route path="admin/sports" element={<AdminListSportComponent />} />
              <Route path="admin/sports/create" element={<AdminCreateSportComponent />} />
              <Route path="admin/sports/:id" element={<AdminDetailSportComponent />} />
              <Route path="admin/sports/:id/edit" element={<AdminEditSportComponent />} />

              <Route path="admin/players" element={<AdminListPlayerComponent />} />
              <Route path="admin/players/create" element={<AdminCreatePlayerComponent />} />
              <Route path="admin/players/:id" element={<AdminDetailPlayerComponent />} />
              <Route path="admin/players/:id/edit" element={<AdminEditPlayerComponent />} />

              <Route path="admin/clubs" element={<AdminListClubComponent />} />
              <Route path="admin/clubs/create" element={<AdminCreateClubComponent />} />
              <Route path="admin/clubs/:id" element={<AdminDetailClubComponent />} />
              <Route path="admin/clubs/:id/edit" element={<AdminEditClubComponent />} />

              <Route path="admin/users" element={<AdminListUserComponent />} />
              <Route path="admin/users/:id" element={<AdminDetailUserComponent />} />
              <Route path="admin/users/create" element={<AdminCreateUserComponent />} />

              <Route path="admin/documents" element={<AdminListDocumentComponent />} />
              <Route path="admin/documents/create" element={<AdminCreateDocument />} />

              <Route path="admin/newsletter/create" element={<AdminCreateNewsletterComponent />} />

              <Route path="admin/transactions" element={<AdminListTransactionsComponent />} />

              <Route path="*" element={<AdminHomeComponent />} />
            </Route>
            <Route path="/logout" element={<LogoutComponent />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

function Layout() {
  return (
    <div className="Content">
      <div className="vertical-menu">
        <AdminHeaderComponent />
      </div>
      <div className="vertical-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
