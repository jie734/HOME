// 简单数据与渲染
const destinations = [
    {id:1,title:'巴厘岛',tag:'海岛',desc:'热带海岛，适合度假与潜水',img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60'},
    {id:2,title:'京都',tag:'文化',desc:'历史古都，寺庙与茶道体验',img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=60'},
    {id:3,title:'马尔代夫',tag:'海岛',desc:'豪华水屋与珊瑚礁潜水',img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=60'},
    {id:4,title:'瑞士阿尔卑斯',tag:'徒步',desc:'高山徒步与冰川美景',img:'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=1200&q=60'},
    {id:5,title:'丽江',tag:'文化',desc:'古城小巷与民族风情',img:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=60'},
    {id:6,title:'纽约',tag:'城市',desc:'现代都市、博物馆与美食',img:'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=60'}
];

const galleryImgs = destinations.map(d=>d.img);

const destGrid = document.getElementById('destGrid');
const gallery = document.getElementById('gallery');

function renderDest(filter=''){
    destGrid.innerHTML = '';
    const list = destinations.filter(d=>!filter||d.tag===filter || d.title.includes(filter));
    list.forEach(d=>{
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `
            <img src="${d.img}&auto=format&fit=crop&w=800&q=60" alt="${d.title}">
            <h3>${d.title}</h3>
            <div class="meta">${d.tag} · ${d.desc}</div>
            <div style="margin-top:8px;text-align:right">
                <button class="btn" data-id="${d.id}" onclick="openDetail(${d.id})">查看</button>
            </div>
        `;
        destGrid.appendChild(el);
    });
}

function renderGallery(){
    gallery.innerHTML = '';
    galleryImgs.forEach((src, i)=>{
        const c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = `<img src="${src}&auto=format&fit=crop&w=1000&q=60" alt="图片${i+1}" onclick="openLightbox('${src}&auto=format&fit=crop&w=1600&q=80')">`;
        gallery.appendChild(c);
    });
}

// lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
window.openLightbox = (src)=>{
    lbImg.src = src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
};
lightbox.addEventListener('click', ()=>{ lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); });

// detail (示例弹窗)
// detail (示例弹窗)
window.openDetail = id => {
    const d = destinations.find(x => x.id === id);
    // 避免多次点击弹窗失效，始终弹出
    setTimeout(() => {
        alert(`${d.title}\n类型：${d.tag}\n简介：${d.desc}\n（此处可跳转到详细页面）`);
    }, 10);
};

// filters（防止重复绑定，且高亮active）
document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
        const filter = btn.dataset.filter;
        renderDest(filter);
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// search
document.getElementById('searchBtn').addEventListener('click', ()=>{
    const q = document.getElementById('q').value.trim();
    const type = document.getElementById('type').value;
    const term = q || type;
    window.location.href = `destinations.html?filter=${encodeURIComponent(term)}`;
});

// quick book & contact forms (简单模拟)
document.getElementById('quickBook').addEventListener('submit',(e)=>{
    e.preventDefault();
    alert('已查询可用（演示）');
});
document.getElementById('contactForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    alert('信息已发送（演示），客服将与您联系。');
    e.target.reset();
});

// comments - 存 localStorage
const commentsEl = document.getElementById('comments');
function loadComments(){
    const items = JSON.parse(localStorage.getItem('comments')||'[]');
    commentsEl.innerHTML = items.length ? items.map(c=>`<div class="comment"><strong>${escapeHtml(c.name)}</strong><div style="font-size:.95rem">${escapeHtml(c.msg)}</div><div class="meta" style="font-size:.8rem">${new Date(c.t).toLocaleString()}</div></div>`).join('') : '<div style="color:var(--muted);padding:8px">还没有评论，成为第一个分享的人！</div>';
}
function escapeHtml(s){ return (s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch])); }

document.getElementById('commentForm').addEventListener('submit', e=>{
    e.preventDefault();
    const name = document.getElementById('cname').value.trim() || '匿名';
    const msg = document.getElementById('cmsg').value.trim();
    if(!msg){ alert('请输入内容'); return; }
    const items = JSON.parse(localStorage.getItem('comments')||'[]');
    items.unshift({name,msg,t:Date.now()});
    localStorage.setItem('comments', JSON.stringify(items.slice(0,200)));
    document.getElementById('cmsg').value = '';
    loadComments();
});

// FAQ search
document.getElementById('faqSearch').addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#faq dt').forEach(dt=>{
        const dd = dt.nextElementSibling;
        const hit = dt.textContent.toLowerCase().includes(q) || dd.textContent.toLowerCase().includes(q);
        dt.style.display = hit ? '' : 'none';
        dd.style.display = hit ? '' : 'none';
    });
});

// nav active 切换（点击后高亮，且只保留一个 active）
document.querySelectorAll('.navlink').forEach(a => {
    a.addEventListener('click', function (e) {
        document.querySelectorAll('.navlink').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        // 若是锚点跳转可加平滑滚动
        // e.preventDefault();
        // document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
    });
});
// nav active 自动高亮当前页面
function setNavActive() {
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.navlink').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href === path) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}
setNavActive();
// 保留点击高亮逻辑，兼容锚点跳转
document.querySelectorAll('.navlink').forEach(a => {
    a.addEventListener('click', function (e) {
        document.querySelectorAll('.navlink').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
    });
});

// initial render
renderDest();
renderGallery();
loadComments();