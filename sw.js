const firebaseConfig = {
  apiKey: "AIzaSyBoPZ6nioxI_fzVrdLSh-pQ_EEqSdPOnrY",
  authDomain: "pattern-for-reporting.firebaseapp.com",
  projectId: "pattern-for-reporting"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ================= STATE =================
let todayEntries = [];
let editingId = null;

// ================= LOAD MONTHLY =================
function loadMonthlyTotals(){

  db.collection("monthly_totals")
    .onSnapshot(snapshot=>{

      const table = document.getElementById("monthlyTotals");

      table.innerHTML = `
        <tr>
          <th>Month</th>
          <th>Store</th>
          <th>Total</th>
          <th>Signed</th>
          <th>Rejected</th>
          <th>Cancelled</th>
        </tr>
      `;

      if(snapshot.empty){
        table.innerHTML += `<tr><td colspan="6">No data</td></tr>`;
        return;
      }

      let grouped = {};

      snapshot.forEach(doc=>{
        const d = doc.data();
        if(!grouped[d.month]) grouped[d.month] = [];
        grouped[d.month].push(d);
      });

      Object.keys(grouped).sort().forEach(month=>{

        let t=0,s=0,r=0,c=0;

        table.innerHTML += `
          <tr style="background:#ddd;font-weight:bold">
            <td colspan="6">${month}</td>
          </tr>
        `;

        grouped[month].forEach(d=>{
          t+=Number(d.total||0);
          s+=Number(d.signed||0);
          r+=Number(d.rejected||0);
          c+=Number(d.cancelled||0);

          table.innerHTML += `
            <tr>
              <td>${d.month}</td>
              <td>${d.store}</td>
              <td>${d.total}</td>
              <td>${d.signed}</td>
              <td>${d.rejected}</td>
              <td>${d.cancelled}</td>
            </tr>
          `;
        });

        table.innerHTML += `
          <tr style="font-weight:bold;background:#f2f2f2">
            <td colspan="2">${month} TOTAL</td>
            <td>${t}</td>
            <td>${s}</td>
            <td>${r}</td>
            <td>${c}</td>
          </tr>
        `;
      });
    });
}

// ================= RECOMPUTE MONTHLY =================
async function recomputeMonthly(){

  const snap = await db.collection("reports").get();

  const map = {};

  snap.forEach(doc=>{
    const d = doc.data();
    const month = d.date?.substring(0,7);
    if(!month) return;

    const key = month + "_" + d.store;

    if(!map[key]){
      map[key] = {
        month,
        store: d.store,
        total:0,
        signed:0,
        rejected:0,
        cancelled:0
      };
    }

    map[key].total += Number(d.total||0);
    map[key].signed += Number(d.signed||0);
    map[key].rejected += Number(d.rejected||0);
    map[key].cancelled += Number(d.cancelled||0);
  });

  const batch = db.batch();

  Object.values(map).forEach(t=>{
    batch.set(db.collection("monthly_totals").doc(t.month+"_"+t.store), t);
  });

  await batch.commit();
}

// ================= BONUS MODAL =================
function openBonus(){
  document.getElementById("bonusModal").style.display = "block";
}

function closeBonus(){
  document.getElementById("bonusModal").style.display = "none";
}

// ================= INIT =================
window.addEventListener("load", ()=>{
  loadMonthlyTotals();
});
