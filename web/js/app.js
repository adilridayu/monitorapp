/* Warehouse Intelligence - Core App */
const MOCK={
categories:[
{id:'CAT001',name:'Elektronik',description:'Perangkat elektronik, gadget, dan perlengkapan komputer',icon:'devices',color:'#6366f1'},
{id:'CAT002',name:'Furnitur',description:'Furnitur kantor termasuk meja, kursi, dan penyimpanan',icon:'chair',color:'#22d3ee'},
{id:'CAT003',name:'Perlengkapan',description:'Perlengkapan kantor, kertas, tinta, dan barang habis pakai',icon:'description',color:'#f59e0b'},
],
items:[
{id:'ITM001',sku:'WH-EL-001',name:'Laptop Dell XPS 15',category:'Elektronik',unit:'pcs',stock:145,min:50,max:500,warehouse:'WH-Jakarta'},
{id:'ITM002',sku:'WH-EL-002',name:'Monitor LG 27"',category:'Elektronik',unit:'pcs',stock:89,min:30,max:300,warehouse:'WH-Jakarta'},
{id:'ITM003',sku:'WH-FN-001',name:'Kursi Kantor Ergonomis',category:'Furnitur',unit:'pcs',stock:23,min:20,max:100,warehouse:'WH-Surabaya'},
{id:'ITM004',sku:'WH-SP-001',name:'Kertas A4 (Box)',category:'Perlengkapan',unit:'box',stock:412,min:100,max:1000,warehouse:'WH-Jakarta'},
{id:'ITM005',sku:'WH-EL-003',name:'Keyboard Mekanikal',category:'Elektronik',unit:'pcs',stock:67,min:25,max:200,warehouse:'WH-Bandung'},
{id:'ITM006',sku:'WH-SP-002',name:'Tinta Cartridge Hitam',category:'Perlengkapan',unit:'pcs',stock:15,min:20,max:150,warehouse:'WH-Surabaya'},
],
movements:[
{id:'MV001',item:'Laptop Dell XPS 15',type:'IN',qty:50,ref:'PO-2026-001',actor:'John Doe',date:'2026-05-06',status:'VALIDATED'},
{id:'MV002',item:'Monitor LG 27"',type:'OUT',qty:12,ref:'SO-2026-015',actor:'Jane Smith',date:'2026-05-06',status:'VALIDATED'},
{id:'MV003',item:'Office Chair',type:'IN',qty:30,ref:'PO-2026-002',actor:'John Doe',date:'2026-05-05',status:'PENDING'},
{id:'MV004',item:'A4 Paper Box',type:'OUT',qty:80,ref:'SO-2026-016',actor:'Bob Wilson',date:'2026-05-05',status:'VALIDATED'},
{id:'MV005',item:'Ink Cartridge',type:'ADJUSTMENT',qty:-5,ref:'ADJ-001',actor:'Admin',date:'2026-05-04',status:'VALIDATED'},
{id:'MV006',item:'Keyboard',type:'TRANSFER',qty:20,ref:'TRF-001',actor:'Jane Smith',date:'2026-05-04',status:'PENDING'},
],
alerts:[
{id:'ALT001',type:'Anomali Stok',item:'Tinta Cartridge Hitam',warehouse:'WH-Surabaya',severity:'CRITICAL',confidence:.94,reasoning:'Stok di bawah batas minimum. Sekarang: 15, Min: 20. Penurunan cepat terdeteksi dalam 7 hari terakhir.',recommendation:'Segera pesan ulang 100 unit.',status:'PENDING',date:'2026-05-06 14:30'},
{id:'ALT002',type:'Prediksi Permintaan',item:'Laptop Dell XPS 15',warehouse:'WH-Jakarta',severity:'HIGH',confidence:.87,reasoning:'Perkiraan kenaikan permintaan 40% dalam 2 minggu ke depan berdasarkan pola historis.',recommendation:'Pre-order 80 unit tambahan.',status:'PENDING',date:'2026-05-06 12:15'},
{id:'ALT003',type:'Pola Pergerakan',item:'Kertas A4 (Box)',warehouse:'WH-Jakarta',severity:'MEDIUM',confidence:.72,reasoning:'Pola pengeluaran tidak biasa terdeteksi. 3x lipat dari normal dalam 48 jam terakhir.',recommendation:'Cek pengiriman keluar dan investigasi.',status:'PENDING',date:'2026-05-05 18:00'},
{id:'ALT004',type:'Stok Menua',item:'Kursi Kantor',warehouse:'WH-Surabaya',severity:'LOW',confidence:.65,reasoning:'25% stok sudah di gudang lebih dari 90 hari.',recommendation:'Pertimbangkan diskon atau redistribusi.',status:'APPROVED',date:'2026-05-04 09:00'},
],
schedules:[
{id:'SCH001',warehouse:'WH-Jakarta',frequency:'DAILY',next:'2026-05-07',status:'Active',inspector:'John Doe'},
{id:'SCH002',warehouse:'WH-Surabaya',frequency:'WEEKLY',next:'2026-05-12',status:'Active',inspector:'Jane Smith'},
{id:'SCH003',warehouse:'WH-Bandung',frequency:'MONTHLY',next:'2026-06-01',status:'Active',inspector:'Bob Wilson'},
],
logs:[
{id:'LOG001',warehouse:'WH-Jakarta',inspector:'John Doe',date:'2026-05-06',result:'PASS',notes:'Semua barang sesuai.'},
{id:'LOG002',warehouse:'WH-Surabaya',inspector:'Jane Smith',date:'2026-05-05',result:'NEEDS_ATTENTION',notes:'Stok tinta cartridge menipis.'},
{id:'LOG003',warehouse:'WH-Jakarta',inspector:'John Doe',date:'2026-05-05',result:'PASS',notes:'Pengecekan rutin selesai.'},
{id:'LOG004',warehouse:'WH-Bandung',inspector:'Bob Wilson',date:'2026-05-01',result:'FAIL',notes:'Ada selisih jumlah keyboard.'},
],
chartData:[
{month:'Jan',inflow:120,outflow:95},{month:'Feb',inflow:150,outflow:110},{month:'Mar',inflow:130,outflow:140},
{month:'Apr',inflow:180,outflow:120},{month:'May',inflow:165,outflow:130},{month:'Jun',inflow:140,outflow:155}
]
};

let currentPage='dashboard';
let stockTab='items';
function togglePassword(){const i=document.getElementById('login-password');const b=event.currentTarget.querySelector('.material-icons-round');if(i.type==='password'){i.type='text';b.textContent='visibility_off'}else{i.type='password';b.textContent='visibility'}}
function showToast(msg,type='info'){const c=document.getElementById('toast-container');const ic=type==='success'?'check_circle':type==='error'?'error':'info';const t=document.createElement('div');t.className='toast '+type;t.innerHTML=`<span class="material-icons-round">${ic}</span><span>${msg}</span>`;c.appendChild(t);setTimeout(()=>t.remove(),3500)}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open')}
function toggleTheme(){const b=document.body;const t=document.getElementById('theme-toggle').querySelector('.material-icons-round');if(b.getAttribute('data-theme')==='light'){b.removeAttribute('data-theme');t.textContent='dark_mode'}else{b.setAttribute('data-theme','light');t.textContent='light_mode'}}

document.getElementById('login-form').addEventListener('submit',function(e){
e.preventDefault();
const email=document.getElementById('login-email').value;
const pass=document.getElementById('login-password').value;
const btn=document.getElementById('login-btn');

const validUsers = [
{email: 'demo@warehouse.com', pass: 'demo123', name: 'Pengguna Demo'},
{email: 'admin@warehouse.com', pass: 'admin123', name: 'Admin Utama'}
];

const user = validUsers.find(u => u.email === email && u.pass === pass);

if(user){
btn.querySelector('.btn-text').classList.add('hidden');btn.querySelector('.btn-loader').classList.remove('hidden');btn.disabled=true;
setTimeout(()=>{
document.getElementById('login-page').classList.remove('active');
document.getElementById('login-page').classList.add('hidden');
document.getElementById('app-shell').classList.remove('hidden');
renderPage('dashboard');
showToast(`Selamat datang kembali, ${user.name}!`,'success');
},1200);
} else {
showToast('Email atau kata sandi salah!','error');
}
});

function logout(){document.getElementById('app-shell').classList.add('hidden');document.getElementById('login-page').classList.remove('hidden');document.getElementById('login-page').classList.add('active');const btn=document.getElementById('login-btn');btn.querySelector('.btn-text').classList.remove('hidden');btn.querySelector('.btn-loader').classList.add('hidden');btn.disabled=false;showToast('Berhasil keluar','info')}

function navigate(page){event.preventDefault();currentPage=page;document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));document.querySelector(`[data-page="${page}"]`).classList.add('active');const titles={dashboard:'Beranda',stock:'Kelola Stok',alerts:'Peringatan AI',monitoring:'Pemantauan',profile:'Profil'};document.getElementById('page-title').textContent=titles[page]||page;renderPage(page);if(window.innerWidth<=1024)toggleSidebar()}

function renderPage(page){const area=document.getElementById('content-area');const fn={dashboard:renderDashboard,stock:renderStock,alerts:renderAlerts,monitoring:renderMonitoring,profile:renderProfile};area.innerHTML='';if(fn[page])fn[page](area)}

function renderDashboard(el){
const pending=MOCK.alerts.filter(a=>a.status==='PENDING').length;
el.innerHTML=`
<div class="stats-grid">
<div class="stat-card"><div class="stat-header"><div class="stat-icon blue"><span class="material-icons-round">inventory_2</span></div><span class="stat-trend up">▲ 12%</span></div><div class="stat-value">${MOCK.items.length}</div><div class="stat-label">Total Barang</div></div>
<div class="stat-card"><div class="stat-header"><div class="stat-icon green"><span class="material-icons-round">warehouse</span></div><span class="stat-trend up">▲ 3</span></div><div class="stat-value">3</div><div class="stat-label">Gudang</div></div>
<div class="stat-card"><div class="stat-header"><div class="stat-icon yellow"><span class="material-icons-round">notifications_active</span></div><span class="stat-trend down">▼ 2</span></div><div class="stat-value">${pending}</div><div class="stat-label">Peringatan Pending</div></div>
<div class="stat-card"><div class="stat-header"><div class="stat-icon red"><span class="material-icons-round">swap_vert</span></div><span class="stat-trend up">▲ 8%</span></div><div class="stat-value">${MOCK.movements.length}</div><div class="stat-label">Pergerakan Hari Ini</div></div>
</div>
<div class="grid-2">
<div class="panel"><div class="panel-header"><h3><span class="material-icons-round">bar_chart</span> Arus Stok</h3></div><div class="panel-body"><div class="chart-container"><div class="chart-bar-group" id="chart-bars"></div><div class="chart-legend"><span><span class="chart-legend-dot" style="background:var(--primary)"></span> Masuk</span><span><span class="chart-legend-dot" style="background:var(--warning)"></span> Keluar</span></div></div></div></div>
<div class="panel"><div class="panel-header"><h3><span class="material-icons-round">warning</span> Peringatan Terbaru</h3><button class="btn btn-sm btn-outline" onclick="navigate('alerts')">Lihat Semua</button></div><div class="panel-body" id="dash-alerts"></div></div>
</div>
<div class="panel"><div class="panel-header"><h3><span class="material-icons-round">history</span> Pergerakan Terbaru</h3><button class="btn btn-sm btn-outline" onclick="navigate('stock')">Lihat Semua</button></div><div class="panel-body"><div class="table-wrap"><table><thead><tr><th>Referensi</th><th>Barang</th><th>Tipe</th><th>Jml</th><th>Pelaku</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>${MOCK.movements.slice(0,4).map(m=>`<tr><td>${m.ref}</td><td>${m.item}</td><td><span class="badge badge-${m.type.toLowerCase()}">${m.type}</span></td><td>${m.qty}</td><td>${m.actor}</td><td>${m.date}</td><td><span class="badge badge-${m.status==='VALIDATED'?'success':'pending'}">${m.status}</span></td></tr>`).join('')}</tbody></table></div></div></div>`;
// Chart
const maxVal=Math.max(...MOCK.chartData.flatMap(d=>[d.inflow,d.outflow]));
document.getElementById('chart-bars').innerHTML=MOCK.chartData.map(d=>`<div class="chart-bar-item"><div style="display:flex;gap:4px;align-items:flex-end;height:100%"><div class="chart-bar in" style="height:${(d.inflow/maxVal)*100}%" title="In: ${d.inflow}"></div><div class="chart-bar out" style="height:${(d.outflow/maxVal)*100}%" title="Out: ${d.outflow}"></div></div><span class="chart-label">${d.month}</span></div>`).join('');
// Alerts
document.getElementById('dash-alerts').innerHTML=MOCK.alerts.filter(a=>a.status==='PENDING').slice(0,3).map(a=>`<div class="alert-card" onclick="showAlertModal('${a.id}')"><div class="alert-severity ${a.severity.toLowerCase()}"></div><div class="alert-content"><div class="alert-title"><span class="badge badge-${a.severity.toLowerCase()}">${a.severity}</span> ${a.type}</div><div class="alert-desc">${a.item} — ${a.warehouse}</div><div class="alert-meta"><span><span class="material-icons-round" style="font-size:14px">schedule</span>${a.date}</span><span><span class="material-icons-round" style="font-size:14px">psychology</span>${Math.round(a.confidence*100)}%</span></div></div></div>`).join('');
}

function renderStock(el){
const catOpts=MOCK.categories.map(c=>`<option>${c.name}</option>`).join('');
el.innerHTML=`
<div class="tabs">
<button class="tab-btn ${stockTab==='items'?'active':''}" onclick="switchStockTab('items')"><span class="material-icons-round" style="font-size:18px">inventory_2</span> Barang <span class="tab-count">${MOCK.items.length}</span></button>
<button class="tab-btn ${stockTab==='categories'?'active':''}" onclick="switchStockTab('categories')"><span class="material-icons-round" style="font-size:18px">category</span> Kategori <span class="tab-count">${MOCK.categories.length}</span></button>
</div>
<div id="stock-tab-content"></div>`;
renderStockTabContent();
}
function switchStockTab(tab){stockTab=tab;document.querySelectorAll('.tab-btn').forEach((b,i)=>{b.classList.toggle('active',i===(tab==='items'?0:1))});renderStockTabContent()}
function renderStockTabContent(){
const el=document.getElementById('stock-tab-content');if(!el)return;
if(stockTab==='items')renderItemsTab(el);else renderCategoriesTab(el);
}
function renderItemsTab(el){
const catOpts=MOCK.categories.map(c=>`<option>${c.name}</option>`).join('');
el.innerHTML=`
<div class="toolbar"><div class="search-box"><span class="material-icons-round">search</span><input type="text" placeholder="Cari barang..." id="stock-search" oninput="filterStock()"></div><select id="stock-cat" onchange="filterStock()"><option value="">Semua Kategori</option>${catOpts}</select><button class="btn btn-primary btn-sm" onclick="showItemModal()"><span class="material-icons-round" style="font-size:18px">add</span> Tambah Barang</button></div>
<div class="panel"><div class="panel-header"><h3><span class="material-icons-round">inventory</span> Daftar Barang</h3></div><div class="panel-body"><div class="table-wrap"><table><thead><tr><th>SKU</th><th>Nama</th><th>Kategori</th><th>Stok</th><th>Min/Max</th><th>Satuan</th><th>Gudang</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="stock-table"></tbody></table></div></div></div>
<div class="panel"><div class="panel-header"><h3><span class="material-icons-round">swap_vert</span> Riwayat Pergerakan</h3><button class="btn btn-outline btn-sm" onclick="showMovementModal()"><span class="material-icons-round" style="font-size:18px">add</span> Pergerakan Baru</button></div><div class="panel-body"><div class="table-wrap"><table><thead><tr><th>Referensi</th><th>Barang</th><th>Tipe</th><th>Jml</th><th>Pelaku</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>${MOCK.movements.map(m=>`<tr><td>${m.ref}</td><td>${m.item}</td><td><span class="badge badge-${m.type.toLowerCase()}">${m.type}</span></td><td>${m.qty}</td><td>${m.actor}</td><td>${m.date}</td><td><span class="badge badge-${m.status==='VALIDATED'?'success':'pending'}">${m.status}</span></td></tr>`).join('')}</tbody></table></div></div></div>`;
renderStockTable(MOCK.items);
}
function renderCategoriesTab(el){
el.innerHTML=`
<div class="toolbar"><div class="search-box"><span class="material-icons-round">search</span><input type="text" placeholder="Cari kategori..." id="cat-search" oninput="filterCategories()"></div><button class="btn btn-primary btn-sm" onclick="showCategoryModal()"><span class="material-icons-round" style="font-size:18px">add</span> Tambah Kategori</button></div>
<div class="cat-grid" id="cat-grid"></div>`;
renderCategoryGrid(MOCK.categories);
}
function renderCategoryGrid(cats){
document.getElementById('cat-grid').innerHTML=cats.map(c=>{
const count=MOCK.items.filter(i=>i.category===c.name).length;
return`<div class="cat-card">
<div class="cat-card-header"><div class="cat-card-icon" style="background:${c.color}15;color:${c.color}"><span class="material-icons-round">${c.icon}</span></div><div class="row-actions"><button onclick="showCategoryModal('${c.id}')" title="Ubah"><span class="material-icons-round">edit</span></button><button class="del" onclick="confirmDelete('category','${c.id}','${c.name}')" title="Hapus"><span class="material-icons-round">delete</span></button></div></div>
<h4>${c.name}</h4><p>${c.description}</p>
<div class="cat-card-footer"><span class="cat-item-count"><span class="material-icons-round" style="font-size:16px">inventory_2</span> ${count} item</span><span class="badge badge-success">Aktif</span></div>
</div>`}).join('');
}
function filterCategories(){
const q=(document.getElementById('cat-search').value||'').toLowerCase();
renderCategoryGrid(MOCK.categories.filter(c=>c.name.toLowerCase().includes(q)||c.description.toLowerCase().includes(q)));
}

function renderStockTable(items){
document.getElementById('stock-table').innerHTML=items.map(i=>{
const status=i.stock<=i.min?'critical':i.stock<=i.min*1.5?'medium':'success';
const label=i.stock<=i.min?'Stok Tipis':i.stock<=i.min*1.5?'Peringatan':'Tersedia';
return`<tr><td><strong>${i.sku}</strong></td><td>${i.name}</td><td>${i.category}</td><td><strong>${i.stock}</strong></td><td>${i.min} / ${i.max}</td><td>${i.unit}</td><td>${i.warehouse}</td><td><span class="badge badge-${status}">${label}</span></td><td><div class="row-actions"><button onclick="showItemModal('${i.id}')" title="Ubah"><span class="material-icons-round">edit</span></button><button class="del" onclick="confirmDelete('item','${i.id}','${i.name}')" title="Hapus"><span class="material-icons-round">delete</span></button></div></td></tr>`}).join('');
}

function filterStock(){
const q=document.getElementById('stock-search').value.toLowerCase();
const cat=document.getElementById('stock-cat').value;
const f=MOCK.items.filter(i=>(!cat||i.category===cat)&&(i.sku.toLowerCase().includes(q)||i.name.toLowerCase().includes(q)));
renderStockTable(f);
}

/* NOTIFICATIONS */
function showNotifications(){
const pending=MOCK.alerts.filter(a=>a.status==='PENDING');
const overlay=getOverlay();
overlay.innerHTML=`<div class="modal" style="max-width:450px"><div class="modal-header"><h3>Notifikasi Tugas AI</h3><button class="btn-icon" onclick="closeModal()"><span class="material-icons-round">close</span></button></div><div class="modal-body" style="padding:0">
${pending.length===0?'<div style="text-align:center;padding:40px;color:var(--text3)">Tidak ada tugas baru</div>':pending.map(a=>`
<div class="alert-item" style="display:flex;flex-direction:column;gap:8px;padding:16px;border-bottom:1px solid var(--border)">
<div style="display:flex;gap:12px;cursor:pointer" onclick="closeModal();showAlertModal('${a.id}')">
<div class="alert-icon-wrap ${a.severity.toLowerCase()}"><span class="material-icons-round" style="font-size:20px">${a.severity==='CRITICAL'?'error':a.severity==='HIGH'?'warning':'info'}</span></div>
<div class="alert-content">
<h4 style="font-size:.9rem;margin-bottom:2px">${a.type}</h4>
<p style="font-size:.8rem;color:var(--text2)">${a.item} — ${a.warehouse}</p>
<span style="font-size:.7rem;color:var(--text3)">${a.date}</span>
</div>
</div>
<div style="display:flex;gap:8px;margin-left:44px">
<button class="btn btn-success btn-sm" style="padding:4px 12px;font-size:.75rem" onclick="handleAlert('${a.id}','APPROVED');showNotifications()">Setujui</button>
<button class="btn btn-outline btn-sm" style="padding:4px 12px;font-size:.75rem" onclick="handleAlert('${a.id}','REJECTED');showNotifications()">Tolak</button>
</div>
</div>`).join('')}
</div><div class="modal-footer"><button class="btn btn-primary btn-full btn-sm" onclick="closeModal();navigate('alerts')">Buka Semua Peringatan</button></div></div>`;
openOverlay(overlay);
}

function renderAlerts(el){
el.innerHTML=`
<div class="toolbar"><div class="search-box"><span class="material-icons-round">search</span><input type="text" placeholder="Cari peringatan..." id="alert-search" oninput="filterAlerts()"></div><select id="alert-sev" onchange="filterAlerts()"><option value="">Semua Level</option><option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select><select id="alert-status" onchange="filterAlerts()"><option value="">Semua Status</option><option>PENDING</option><option>APPROVED</option><option>REJECTED</option></select></div>
<div id="alerts-list"></div>`;
renderAlertsList(MOCK.alerts);
}

function renderAlertsList(alerts){
document.getElementById('alerts-list').innerHTML=alerts.map(a=>`
<div class="alert-card" onclick="showAlertModal('${a.id}')">
<div class="alert-severity ${a.severity.toLowerCase()}"></div>
<div class="alert-content">
<div class="alert-title"><span class="badge badge-${a.severity.toLowerCase()}">${a.severity}</span> ${a.type}</div>
<div class="alert-desc">${a.reasoning.substring(0,100)}...</div>
<div class="alert-meta"><span><span class="material-icons-round" style="font-size:14px">inventory_2</span>${a.item}</span><span><span class="material-icons-round" style="font-size:14px">warehouse</span>${a.warehouse}</span><span><span class="material-icons-round" style="font-size:14px">schedule</span>${a.date}</span></div>
</div>
<div class="alert-actions">
<span class="badge badge-${a.status==='PENDING'?'pending':a.status==='APPROVED'?'success':'high'}">${a.status}</span>
<div style="display:flex;align-items:center;gap:4px;margin-top:4px"><span style="font-size:.75rem;color:var(--text3)">Keyakinan</span><div class="confidence-bar"><div class="confidence-fill" style="width:${a.confidence*100}%;background:${a.confidence>.8?'var(--success)':a.confidence>.6?'var(--warning)':'var(--danger)'}"></div></div><span style="font-size:.75rem;font-weight:600">${Math.round(a.confidence*100)}%</span></div>
</div></div>`).join('');
}

function filterAlerts(){
const q=(document.getElementById('alert-search').value||'').toLowerCase();
const sev=document.getElementById('alert-sev').value;
const st=document.getElementById('alert-status').value;
const f=MOCK.alerts.filter(a=>(a.type.toLowerCase().includes(q)||a.item.toLowerCase().includes(q))&&(!sev||a.severity===sev)&&(!st||a.status===st));
renderAlertsList(f);
}

function renderMonitoring(el){
el.innerHTML=`
<div class="panel"><div class="panel-header"><h3><span class="material-icons-round">event</span> Jadwal</h3></div><div class="panel-body">${MOCK.schedules.map(s=>`
<div class="schedule-card"><div class="schedule-icon"><span class="material-icons-round">event_repeat</span></div><div class="schedule-info"><h4>${s.warehouse}</h4><p>${s.frequency} &bull; Selanjutnya: ${s.next} &bull; Inspektur: ${s.inspector}</p></div><span class="badge badge-success">${s.status}</span></div>`).join('')}</div></div>
<div class="panel"><div class="panel-header"><h3><span class="material-icons-round">fact_check</span> Log Inspeksi</h3></div><div class="panel-body"><div class="table-wrap"><table><thead><tr><th>Gudang</th><th>Inspektur</th><th>Tanggal</th><th>Hasil</th><th>Catatan</th></tr></thead><tbody>${MOCK.logs.map(l=>`<tr><td>${l.warehouse}</td><td>${l.inspector}</td><td>${l.date}</td><td><span class="badge badge-${l.result==='PASS'?'success':l.result==='FAIL'?'high':'medium'}">${l.result}</span></td><td>${l.notes}</td></tr>`).join('')}</tbody></table></div></div></div>`;
}

function renderProfile(el){
el.innerHTML=`
<div class="profile-header"><div class="profile-avatar">DU</div><div class="profile-details"><h3>Pengguna Demo</h3><p>demo@warehouse.com &bull; Admin &bull; WH-Jakarta</p></div></div>
<div class="grid-2">
<div><div class="settings-group"><h4>Akun</h4>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">person</span><div><div class="setting-label">Nama Lengkap</div><div class="setting-desc">Pengguna Demo</div></div></div></div>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">email</span><div><div class="setting-label">Email</div><div class="setting-desc">demo@warehouse.com</div></div></div></div>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">badge</span><div><div class="setting-label">Jabatan</div><div class="setting-desc">Admin</div></div></div></div>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">warehouse</span><div><div class="setting-label">Gudang</div><div class="setting-desc">WH-Jakarta (Utama)</div></div></div></div>
</div></div>
<div><div class="settings-group"><h4>Pengaturan</h4>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">notifications</span><div><div class="setting-label">Notifikasi</div><div class="setting-desc">Email & Push aktif</div></div></div><span class="badge badge-success">AKTIF</span></div>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">dark_mode</span><div><div class="setting-label">Mode Gelap</div><div class="setting-desc">Gunakan tema gelap</div></div></div><span class="badge badge-success">AKTIF</span></div>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">language</span><div><div class="setting-label">Bahasa</div><div class="setting-desc">Bahasa Indonesia</div></div></div></div>
<div class="setting-item"><div class="setting-left"><span class="material-icons-round">update</span><div><div class="setting-label">Sesi</div><div class="setting-desc">Aktif sejak 05:10 AM</div></div></div></div>
</div>
<button class="btn btn-danger btn-full" style="margin-top:16px" onclick="logout()"><span class="material-icons-round" style="font-size:18px">logout</span> Keluar</button>
</div></div>`;
}

/* MODALS */
function showAlertModal(id){
const a=MOCK.alerts.find(x=>x.id===id);if(!a)return;
let overlay=document.querySelector('.modal-overlay');
if(!overlay){overlay=document.createElement('div');overlay.className='modal-overlay';document.body.appendChild(overlay)}
overlay.innerHTML=`<div class="modal"><div class="modal-header"><h3>${a.type}</h3><button class="btn-icon" onclick="closeModal()"><span class="material-icons-round">close</span></button></div><div class="modal-body">
<div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap"><span class="badge badge-${a.severity.toLowerCase()}">${a.severity}</span><span class="badge badge-${a.status==='PENDING'?'pending':a.status==='APPROVED'?'success':'high'}">${a.status}</span></div>
<div class="form-row"><label>Barang</label><div style="padding:10px 14px;background:var(--bg2);border-radius:var(--radius-sm)">${a.item} — ${a.warehouse}</div></div>
<div class="form-row"><label>Analisa AI</label><div style="padding:10px 14px;background:var(--bg2);border-radius:var(--radius-sm);font-size:.9rem;line-height:1.6">${a.reasoning}</div></div>
<div class="form-row"><label>Rekomendasi</label><div style="padding:10px 14px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.15);border-radius:var(--radius-sm);font-size:.9rem">${a.recommendation}</div></div>
<div style="display:flex;align-items:center;gap:12px;margin-top:8px"><span style="font-size:.85rem;color:var(--text2)">Tingkat Keyakinan:</span><div class="confidence-bar" style="width:160px"><div class="confidence-fill" style="width:${a.confidence*100}%;background:${a.confidence>.8?'var(--success)':'var(--warning)'}"></div></div><strong>${Math.round(a.confidence*100)}%</strong></div>
</div>${a.status==='PENDING'?`<div class="modal-footer"><button class="btn btn-danger btn-sm" onclick="handleAlert('${a.id}','REJECTED')"><span class="material-icons-round" style="font-size:16px">close</span> Tolak</button><button class="btn btn-success btn-sm" onclick="handleAlert('${a.id}','APPROVED')"><span class="material-icons-round" style="font-size:16px">check</span> Setujui</button></div>`:''}</div>`;
requestAnimationFrame(()=>overlay.classList.add('active'));
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
}

function handleAlert(id,status){
const a=MOCK.alerts.find(x=>x.id===id);if(a)a.status=status;
closeModal();showToast(`Peringatan berhasil di${status==='APPROVED'?'setujui':'tolak'}`,status==='APPROVED'?'success':'info');
const badge=document.getElementById('alert-badge');const pending=MOCK.alerts.filter(x=>x.status==='PENDING').length;
badge.textContent=pending;if(pending===0)badge.classList.add('hidden');
updateNotifBadge();
renderPage(currentPage);
}

function showMovementModal(){
let overlay=document.querySelector('.modal-overlay');
if(!overlay){overlay=document.createElement('div');overlay.className='modal-overlay';document.body.appendChild(overlay)}
overlay.innerHTML=`<div class="modal"><div class="modal-header"><h3>Pergerakan Stok Baru</h3><button class="btn-icon" onclick="closeModal()"><span class="material-icons-round">close</span></button></div><div class="modal-body">
<div class="form-row"><label>Barang</label><select id="mv-item">${MOCK.items.map(i=>`<option value="${i.name}">${i.sku} - ${i.name}</option>`).join('')}</select></div>
<div class="form-row"><label>Tipe Pergerakan</label><select id="mv-type"><option value="IN">MASUK (IN)</option><option value="OUT">KELUAR (OUT)</option><option value="ADJUSTMENT">PENYESUAIAN</option><option value="TRANSFER">TRANSFER</option></select></div>
<div class="form-row"><label>Jumlah</label><input type="number" id="mv-qty" min="1" value="1"></div>
<div class="form-row"><label>Nomor Referensi</label><input type="text" id="mv-ref" placeholder="Contoh: PO-2026-003"></div>
<div class="form-row"><label>Catatan</label><textarea id="mv-notes" placeholder="Catatan tambahan (opsional)..."></textarea></div>
</div><div class="modal-footer"><button class="btn btn-outline btn-sm" onclick="closeModal()">Batal</button><button class="btn btn-primary btn-sm" onclick="submitMovement()"><span class="material-icons-round" style="font-size:16px">check</span> Kirim</button></div></div>`;
requestAnimationFrame(()=>overlay.classList.add('active'));
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
}

function submitMovement(){
const item=document.getElementById('mv-item').value;
const type=document.getElementById('mv-type').value;
const qty=document.getElementById('mv-qty').value;
const ref=document.getElementById('mv-ref').value||'REF-AUTO';
MOCK.movements.unshift({id:'MV'+(MOCK.movements.length+1).toString().padStart(3,'0'),item,type,qty:parseInt(qty),ref,actor:'Pengguna Demo',date:new Date().toISOString().split('T')[0],status:'PENDING'});
closeModal();showToast('Pergerakan berhasil dicatat','success');renderPage(currentPage);
}

function closeModal(){const o=document.querySelector('.modal-overlay');if(o){o.classList.remove('active');setTimeout(()=>o.remove(),300)}}

/* CATEGORY CRUD */
function showCategoryModal(editId){
const cat=editId?MOCK.categories.find(c=>c.id===editId):null;
const title=cat?'Ubah Kategori':'Tambah Kategori';
const overlay=getOverlay();
overlay.innerHTML=`<div class="modal"><div class="modal-header"><h3>${title}</h3><button class="btn-icon" onclick="closeModal()"><span class="material-icons-round">close</span></button></div><div class="modal-body">
<div class="form-row"><label>Nama</label><input type="text" id="cat-name" value="${cat?cat.name:''}" placeholder="Contoh: Elektronik"></div>
<div class="form-row"><label>Deskripsi</label><textarea id="cat-desc" placeholder="Deskripsi kategori...">${cat?cat.description:''}</textarea></div>
<div class="form-row"><label>Ikon (Nama Material Icon)</label><input type="text" id="cat-icon" value="${cat?cat.icon:'category'}" placeholder="Contoh: devices, chair, description"></div>
<div class="form-row"><label>Warna</label><input type="color" id="cat-color" value="${cat?cat.color:'#6366f1'}" style="height:42px;cursor:pointer"></div>
</div><div class="modal-footer"><button class="btn btn-outline btn-sm" onclick="closeModal()">Batal</button><button class="btn btn-primary btn-sm" onclick="saveCategory('${editId||''}')">${cat?'Simpan Perubahan':'Buat Kategori'}</button></div></div>`;
openOverlay(overlay);
}
function saveCategory(editId){
const name=document.getElementById('cat-name').value.trim();
const desc=document.getElementById('cat-desc').value.trim();
const icon=document.getElementById('cat-icon').value.trim()||'category';
const color=document.getElementById('cat-color').value;
if(!name){showToast('Nama kategori wajib diisi','error');return}
if(editId){
const c=MOCK.categories.find(x=>x.id===editId);
if(c){const oldName=c.name;c.name=name;c.description=desc;c.icon=icon;c.color=color;MOCK.items.forEach(i=>{if(i.category===oldName)i.category=name})}
showToast('Kategori berhasil diperbarui','success');
}else{
MOCK.categories.push({id:'CAT'+String(MOCK.categories.length+1).padStart(3,'0'),name,description:desc,icon,color});
showToast('Kategori baru berhasil dibuat','success');
}
closeModal();renderPage(currentPage);
}

/* ITEM CRUD */
function showItemModal(editId){
const item=editId?MOCK.items.find(i=>i.id===editId):null;
const title=item?'Ubah Barang':'Tambah Barang';
const catOpts=MOCK.categories.map(c=>`<option ${item&&item.category===c.name?'selected':''}>${c.name}</option>`).join('');
const overlay=getOverlay();
overlay.innerHTML=`<div class="modal"><div class="modal-header"><h3>${title}</h3><button class="btn-icon" onclick="closeModal()"><span class="material-icons-round">close</span></button></div><div class="modal-body">
<div class="form-row"><label>SKU</label><input type="text" id="item-sku" value="${item?item.sku:''}" placeholder="Contoh: WH-EL-004"></div>
<div class="form-row"><label>Nama Barang</label><input type="text" id="item-name" value="${item?item.name:''}" placeholder="Contoh: Mouse Wireless"></div>
<div class="form-row"><label>Kategori</label><select id="item-cat">${catOpts}</select></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
<div class="form-row"><label>Satuan</label><input type="text" id="item-unit" value="${item?item.unit:'pcs'}" placeholder="pcs, box, dll."></div>
<div class="form-row"><label>Stok Sekarang</label><input type="number" id="item-stock" value="${item?item.stock:0}" min="0"></div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
<div class="form-row"><label>Batas Stok Minimum</label><input type="number" id="item-min" value="${item?item.min:10}" min="0"></div>
<div class="form-row"><label>Batas Stok Maksimum</label><input type="number" id="item-max" value="${item?item.max:100}" min="0"></div>
</div>
<div class="form-row"><label>Lokasi Gudang</label><select id="item-wh"><option ${item&&item.warehouse==='WH-Jakarta'?'selected':''}>WH-Jakarta</option><option ${item&&item.warehouse==='WH-Surabaya'?'selected':''}>WH-Surabaya</option><option ${item&&item.warehouse==='WH-Bandung'?'selected':''}>WH-Bandung</option></select></div>
</div><div class="modal-footer"><button class="btn btn-outline btn-sm" onclick="closeModal()">Batal</button><button class="btn btn-primary btn-sm" onclick="saveItem('${editId||''}')">${item?'Simpan Perubahan':'Buat Barang'}</button></div></div>`;
openOverlay(overlay);
}
function saveItem(editId){
const sku=document.getElementById('item-sku').value.trim();
const name=document.getElementById('item-name').value.trim();
const cat=document.getElementById('item-cat').value;
const unit=document.getElementById('item-unit').value.trim()||'pcs';
const stock=parseInt(document.getElementById('item-stock').value)||0;
const min=parseInt(document.getElementById('item-min').value)||0;
const max=parseInt(document.getElementById('item-max').value)||100;
const wh=document.getElementById('item-wh').value;
if(!sku||!name){showToast('SKU dan Nama wajib diisi','error');return}
if(editId){
const i=MOCK.items.find(x=>x.id===editId);
if(i){Object.assign(i,{sku,name,category:cat,unit,stock,min,max,warehouse:wh})}
showToast('Barang berhasil diperbarui','success');
}else{
MOCK.items.push({id:'ITM'+String(MOCK.items.length+1).padStart(3,'0'),sku,name,category:cat,unit,stock,min,max,warehouse:wh});
showToast('Barang baru berhasil dibuat','success');
}
closeModal();renderPage(currentPage);
}

/* DELETE CONFIRM */
function confirmDelete(type,id,name){
const overlay=getOverlay();
overlay.innerHTML=`<div class="modal" style="max-width:400px"><div class="modal-header"><h3>Konfirmasi Hapus</h3><button class="btn-icon" onclick="closeModal()"><span class="material-icons-round">close</span></button></div><div class="modal-body">
<div class="confirm-icon"><span class="material-icons-round">warning</span></div>
<div class="confirm-text">Yakin mau hapus ${type==='category'?'kategori':'barang'} ini?<strong>${name}</strong></div>
${type==='category'?'<p style="text-align:center;font-size:.8rem;color:var(--warning);margin-top:8px">Barang di kategori ini akan menjadi "Tanpa Kategori".</p>':''}
</div><div class="modal-footer"><button class="btn btn-outline btn-sm" onclick="closeModal()">Batal</button><button class="btn btn-danger btn-sm" onclick="executeDelete('${type}','${id}')"><span class="material-icons-round" style="font-size:16px">delete</span> Hapus</button></div></div>`;
openOverlay(overlay);
}
function executeDelete(type,id){
if(type==='category'){
const c=MOCK.categories.find(x=>x.id===id);
if(c)MOCK.items.forEach(i=>{if(i.category===c.name)i.category='Tanpa Kategori'});
MOCK.categories=MOCK.categories.filter(x=>x.id!==id);
showToast('Kategori dihapus','success');
}else{
MOCK.items=MOCK.items.filter(x=>x.id!==id);
showToast('Barang dihapus','success');
}
closeModal();renderPage(currentPage);
}

/* MODAL HELPERS */
function getOverlay(){let o=document.querySelector('.modal-overlay');if(!o){o=document.createElement('div');o.className='modal-overlay';document.body.appendChild(o)}return o}
function openOverlay(o){requestAnimationFrame(()=>o.classList.add('active'));o.addEventListener('click',e=>{if(e.target===o)closeModal()})}
function updateNotifBadge(){
const dot=document.querySelector('.notif-dot');
const pending=MOCK.alerts.filter(x=>x.status==='PENDING').length;
if(dot){
if(pending>0)dot.classList.remove('hidden');
else dot.classList.add('hidden');
}
}

// Initial update
window.addEventListener('load', updateNotifBadge);
